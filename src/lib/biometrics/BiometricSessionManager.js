// src/lib/biometrics/BiometricSessionManager.js
// Manages ephemeral, tamper-evident biometric verification sessions, cryptographic nonces,
// rate-limiting counters, and session expiration (180-second TTL).

const SESSION_TTL_SECONDS = 180;
const MAX_VERIFICATION_ATTEMPTS = 3;
const COOLDOWN_MINUTES = 5;

const STORAGE_SESSION_KEY = 'knust_biometric_session';
const STORAGE_RATE_LIMIT_KEY = 'knust_biometric_ratelimit';

let _memorySessionStore = null;
const _memoryRateLimitStore = new Map();

export class BiometricSessionManager {
  /**
   * Generates a new cryptographically bound verification session
   * @param {string} studentId 
   * @param {string} electionId 
   * @param {Array<Object>} challenges 
   * @returns {Object} Active verification session
   */
  static createSession(studentId, electionId, challenges = []) {
    this._checkRateLimit(studentId);

    const sessionId = 'bio_sess_' + Math.random().toString(36).slice(2, 12) + '_' + Date.now().toString(36);
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const now = Date.now();
    const expiresAt = now + (SESSION_TTL_SECONDS * 1000);

    const session = {
      sessionId,
      nonce,
      studentId,
      electionId,
      challenges,
      createdAt: now,
      expiresAt,
      attemptCount: 0,
      maxAttempts: MAX_VERIFICATION_ATTEMPTS,
      isVerified: false,
      isConsumed: false,
      verificationToken: null,
      verificationProof: null
    };

    _memorySessionStore = JSON.parse(JSON.stringify(session));
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    }

    return session;
  }

  /**
   * Retrieves active session and verifies expiration
   */
  static getActiveSession() {
    let raw = null;
    if (typeof sessionStorage !== 'undefined') {
      raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
    }
    
    let session = raw ? JSON.parse(raw) : _memorySessionStore;
    if (!session) return null;

    if (Date.now() > session.expiresAt || session.isConsumed) {
      this.clearSession();
      return null;
    }
    return session;
  }

  /**
   * Records a verification attempt and checks attempt limits
   */
  static recordAttempt(studentId) {
    const session = this.getActiveSession();
    if (!session) return { allowed: false, remainingAttempts: 0, error: 'SESSION_EXPIRED' };

    session.attemptCount += 1;
    const remainingAttempts = Math.max(0, session.maxAttempts - session.attemptCount);

    if (session.attemptCount >= session.maxAttempts) {
      this._triggerCooldown(studentId);
      this.clearSession();
      return {
        allowed: false,
        remainingAttempts: 0,
        error: 'TOO_MANY_ATTEMPTS',
        cooldownSeconds: COOLDOWN_MINUTES * 60
      };
    }

    _memorySessionStore = JSON.parse(JSON.stringify(session));
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    }
    return {
      allowed: true,
      remainingAttempts,
      error: null
    };
  }

  /**
   * Authorizes a successful verification session and mints a single-use token
   */
  static async finalizeVerification(studentId, electionId, matchResult, livenessResult) {
    const session = this.getActiveSession();
    if (!session) {
      throw new Error('Verification session has expired. Please restart biometric verification.');
    }

    if (session.studentId !== studentId) {
      throw new Error('Biometric session student identity mismatch.');
    }

    // Generate cryptographic token
    const tokenPayload = `${session.sessionId}:${session.nonce}:${studentId}:${electionId}:${Date.now()}`;
    const tokenHash = await this._sha256(tokenPayload);
    const verificationToken = `KNUST_BIO_${tokenHash.slice(0, 32).toUpperCase()}`;

    session.isVerified = true;
    session.verificationToken = verificationToken;
    session.verificationProof = {
      similarity: matchResult.similarity,
      confidence: matchResult.confidence,
      livenessScore: livenessResult.passiveScore,
      verifiedAt: new Date().toISOString()
    };

    _memorySessionStore = JSON.parse(JSON.stringify(session));
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    }
    this._resetRateLimit(studentId);

    return {
      sessionId: session.sessionId,
      verificationToken,
      expiresAt: session.expiresAt,
      proof: session.verificationProof
    };
  }

  /**
   * Consumes verification token upon ballot submission to prevent token reuse
   */
  static consumeSessionToken(token) {
    const session = this.getActiveSession();
    if (!session || session.verificationToken !== token) {
      return false;
    }
    session.isConsumed = true;
    _memorySessionStore = JSON.parse(JSON.stringify(session));
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    }
    return true;
  }

  static clearSession() {
    _memorySessionStore = null;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }

  // Rate Limiting and Anti-Brute-Force helpers
  static _checkRateLimit(studentId) {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(`${STORAGE_RATE_LIMIT_KEY}_${studentId}`);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Date.now() < data.lockedUntil) {
        const remainingSec = Math.ceil((data.lockedUntil - Date.now()) / 1000);
        throw new Error(`Too many unsuccessful verification attempts. Please wait ${remainingSec} seconds before trying again.`);
      }
    } catch (e) {
      if (e.message?.includes('Too many')) throw e;
    }
  }

  static _triggerCooldown(studentId) {
    if (typeof localStorage === 'undefined') return;
    const lockedUntil = Date.now() + (COOLDOWN_MINUTES * 60 * 1000);
    localStorage.setItem(`${STORAGE_RATE_LIMIT_KEY}_${studentId}`, JSON.stringify({ lockedUntil }));
  }

  static _resetRateLimit(studentId) {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(`${STORAGE_RATE_LIMIT_KEY}_${studentId}`);
  }

  static async _sha256(str) {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const buffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  }
}

export default BiometricSessionManager;
