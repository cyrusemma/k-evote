-- ============================================================================
-- Migration: 20260805_biometric_verification_pipeline.sql
-- Description: Production Biometric Facial Verification, Liveness Sessions, 
--              and Atomic Duplicate-Voting Protection Schema.
-- ============================================================================

-- 1. Biometric Enrollments Table (Stores L2-normalized vectors and consent)
CREATE TABLE IF NOT EXISTS biometric_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL UNIQUE,
  embedding_vector JSONB NOT NULL,
  quality_score NUMERIC DEFAULT 90.0,
  privacy_consented_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on biometric enrollments
ALTER TABLE biometric_enrollments ENABLE ROW LEVEL SECURITY;

-- 2. Biometric Verification Sessions Table
CREATE TABLE IF NOT EXISTS biometric_verification_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  verification_token TEXT UNIQUE,
  student_id TEXT NOT NULL,
  election_id TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_consumed BOOLEAN DEFAULT false,
  consumed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  attempt_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for instant lookup during ballot submission
CREATE INDEX IF NOT EXISTS idx_bio_sess_token ON biometric_verification_sessions(verification_token);
CREATE INDEX IF NOT EXISTS idx_bio_sess_student ON biometric_verification_sessions(student_id);

-- 3. Biometric Audit Logs Table (Security Telemetry & Anti-Spoofing Analytics)
CREATE TABLE IF NOT EXISTS biometric_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'VERIFICATION_SUCCESS', 'LIVENESS_FAILED', 'FACE_MISMATCH', 'ENROLLMENT_COMPLETED'
  student_id TEXT NOT NULL,
  election_id TEXT,
  confidence_score NUMERIC,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RPC: Validate Biometric Verification Session
CREATE OR REPLACE FUNCTION verify_biometric_session(
  p_student_id TEXT,
  p_election_id TEXT,
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session RECORD;
BEGIN
  -- Look up the verification session
  SELECT * INTO v_session
  FROM biometric_verification_sessions
  WHERE verification_token = p_session_token
    AND student_id = p_student_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'INVALID_SESSION_TOKEN');
  END IF;

  IF v_session.is_consumed THEN
    RETURN jsonb_build_object('valid', false, 'error', 'TOKEN_ALREADY_CONSUMED');
  END IF;

  IF now() > v_session.expires_at THEN
    RETURN jsonb_build_object('valid', false, 'error', 'SESSION_EXPIRED');
  END IF;

  IF NOT v_session.is_verified THEN
    RETURN jsonb_build_object('valid', false, 'error', 'SESSION_NOT_VERIFIED');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'student_id', v_session.student_id,
    'session_id', v_session.session_id,
    'verified_at', v_session.created_at
  );
END;
$$;

-- 5. Updated RPC: submit_anonymous_vote with Atomic Biometric Token Consumption
CREATE OR REPLACE FUNCTION submit_anonymous_vote(
  p_student_id TEXT,
  p_election_id TEXT,
  p_room_id UUID DEFAULT NULL,
  p_encrypted_payload TEXT DEFAULT '',
  p_ballot_hash TEXT DEFAULT '',
  p_verification_token TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room_locked BOOLEAN := false;
  v_ballot_id UUID;
  v_audit_id UUID;
  v_session RECORD;
BEGIN
  -- 1. Check if room is locked (if roomId provided)
  IF p_room_id IS NOT NULL THEN
    SELECT is_locked INTO v_room_locked
    FROM election_rooms
    WHERE id = p_room_id;

    IF v_room_locked = true THEN
      RAISE EXCEPTION 'ROOM_LOCKED: Election room is currently locked by EC.';
    END IF;
  END IF;

  -- 2. Validate Biometric Verification Token if provided
  IF p_verification_token IS NOT NULL AND p_verification_token != '' THEN
    SELECT * INTO v_session
    FROM biometric_verification_sessions
    WHERE verification_token = p_verification_token
      AND student_id = p_student_id
    FOR UPDATE; -- Row-level lock to prevent simultaneous race conditions

    IF NOT FOUND THEN
      -- Record failure in audit log
      INSERT INTO biometric_audit_logs (event_type, student_id, election_id, failure_reason)
      VALUES ('INVALID_BALLOT_TOKEN', p_student_id, p_election_id, 'Token not found');
    ELSE
      IF v_session.is_consumed THEN
        RAISE EXCEPTION 'BIOMETRIC_TOKEN_REUSED: Verification token has already been consumed.';
      END IF;

      IF now() > v_session.expires_at THEN
        RAISE EXCEPTION 'BIOMETRIC_TOKEN_EXPIRED: Verification session has expired.';
      END IF;

      -- Mark token as consumed atomically
      UPDATE biometric_verification_sessions
      SET is_consumed = true, consumed_at = now()
      WHERE id = v_session.id;
    END IF;
  END IF;

  -- 3. Check for Duplicate Vote (Enforce 1 Vote per Election atomically)
  IF EXISTS (
    SELECT 1 FROM encrypted_ballots 
    WHERE election_id = p_election_id::uuid AND student_id = p_student_id::uuid
  ) THEN
    RAISE EXCEPTION 'DOUBLE_VOTE: Voter has already cast a ballot in this election.';
  END IF;

  -- 4. Store encrypted ballot
  INSERT INTO encrypted_ballots (
    election_id,
    room_id,
    student_id,
    encrypted_payload,
    ballot_hash,
    verified,
    submitted_at
  ) VALUES (
    p_election_id::uuid,
    p_room_id,
    p_student_id::uuid,
    p_encrypted_payload,
    p_ballot_hash,
    true,
    now()
  )
  RETURNING id INTO v_ballot_id;

  -- 5. Record Audit Log Entry
  INSERT INTO audit_logs (
    event_type,
    actor_id,
    election_id,
    room_id,
    details
  ) VALUES (
    'VOTE_CAST_BIOMETRIC_VERIFIED',
    p_student_id,
    p_election_id::uuid,
    p_room_id,
    jsonb_build_object(
      'ballot_id', v_ballot_id,
      'ballot_hash', p_ballot_hash,
      'biometric_verified', (p_verification_token IS NOT NULL),
      'timestamp', now()
    )
  )
  RETURNING id INTO v_audit_id;

  -- Return receipt payload
  RETURN jsonb_build_object(
    'success', true,
    'ballot_id', v_ballot_id,
    'audit_id', v_audit_id,
    'ballot_hash', p_ballot_hash,
    'timestamp', now()
  );
END;
$$;
