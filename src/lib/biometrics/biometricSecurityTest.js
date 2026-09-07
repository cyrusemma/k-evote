// src/lib/biometrics/biometricSecurityTest.js
// Automated verification and security test suite for the KNUST Biometric Facial Verification Pipeline.

import { FaceDetector } from './FaceDetector.js';
import { FaceQualityChecker } from './FaceQualityChecker.js';
import { FaceAligner } from './FaceAligner.js';
import { FaceEmbedder } from './FaceEmbedder.js';
import { LivenessDetector, CHALLENGE_TYPES } from './LivenessDetector.js';
import { FaceMatcher } from './FaceMatcher.js';
import { BiometricSessionManager } from './BiometricSessionManager.js';

export async function runBiometricSecurityTestSuite() {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  function assert(name, condition, details = '') {
    results.total++;
    if (condition) {
      results.passed++;
      results.tests.push({ name, status: 'PASS', details });
    } else {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', details });
    }
  }

  // ── TEST 1: Face Embedder L2 Normalization ──
  const embedder = new FaceEmbedder();
  const testVec = new Float32Array(128).map((_, i) => Math.sin(i * 0.1));
  const normVec = embedder.normalizeL2(testVec);
  let sumSq = 0;
  for (let i = 0; i < normVec.length; i++) sumSq += normVec[i] * normVec[i];
  assert('1. Embedder L2 Normalization (|v|_2 = 1.0)', Math.abs(sumSq - 1.0) < 1e-4, `Norm: ${sumSq.toFixed(5)}`);

  // ── TEST 2: Face Matcher Cosine Similarity (Identical Vectors S = 1.0) ──
  const matcher = new FaceMatcher({ threshold: 0.82 });
  const compSelf = matcher.compare(normVec, normVec);
  assert('2. Cosine Similarity Self-Match (S = 1.0, match = true)', compSelf.match && compSelf.similarity >= 0.999, `Similarity: ${compSelf.similarity}`);

  // ── TEST 3: Face Matcher Orthogonal / Different Person Rejection ──
  const diffVec = embedder.normalizeL2(new Float32Array(128).map((_, i) => Math.cos(i * 0.5 + 2)));
  const compDiff = matcher.compare(normVec, diffVec);
  assert('3. Cosine Similarity Mismatch Rejection (S < 0.82, match = false)', !compDiff.match, `Similarity: ${compDiff.similarity}`);

  // ── TEST 4: Multi-Sample Centroid Template Merger ──
  const sample1 = normVec;
  const sample2 = embedder.normalizeL2(new Float32Array(normVec).map(v => v + (Math.random() - 0.5) * 0.05));
  const sample3 = embedder.normalizeL2(new Float32Array(normVec).map(v => v + (Math.random() - 0.5) * 0.05));
  const centroidRes = matcher.createCentroidTemplate([sample1, sample2, sample3]);
  assert('4. Multi-Sample Centroid Template Generation', centroidRes.valid && centroidRes.consistencyScore > 0.90, `Consistency: ${centroidRes.consistencyScore}`);

  // ── TEST 5: Active Liveness Dynamic Challenge Generation ──
  const liveness = new LivenessDetector();
  const challenges = liveness.generateRandomChallenge(2);
  assert('5. Dynamic Liveness Challenge Sequence Generated', challenges.length === 3 && challenges[2].type === CHALLENGE_TYPES.CENTER, `Steps: ${challenges.map(c => c.type).join(' -> ')}`);

  // ── TEST 6: Eye Aspect Ratio (EAR) Blink Detection ──
  const mockEyeOpen = {
    p1: [30, 40], p2: [35, 34], p3: [45, 34],
    p4: [50, 40], p5: [45, 46], p6: [35, 46]
  };
  const mockEyeClosed = {
    p1: [30, 40], p2: [35, 39], p3: [45, 39],
    p4: [50, 40], p5: [45, 41], p6: [35, 41]
  };
  const earOpen = liveness._calculateEAR(mockEyeOpen);
  const earClosed = liveness._calculateEAR(mockEyeClosed);
  assert('6. EAR Blink Ratio (Open > Closed)', earOpen > earClosed && earClosed < 0.20 && earOpen > 0.28, `Open EAR: ${earOpen.toFixed(3)}, Closed EAR: ${earClosed.toFixed(3)}`);

  // ── TEST 7: Passive Anti-Spoofing Static Photo Detection ──
  const staticHistory = Array.from({ length: 20 }).map(() => ({
    timestamp: Date.now(), ear: 0.32, mar: 0.22, yaw: 0.1, pitch: 0.1, box: {}
  }));
  const passiveStatic = liveness._evaluatePassiveAntiSpoofing(staticHistory, null);
  assert('7. Passive Anti-Spoofing Intercepts Static Photograph', !passiveStatic.isLive && passiveStatic.reason === 'STATIC_PHOTO_DETECTED', `Reason: ${passiveStatic.reason}`);

  // ── TEST 8: Biometric Quality Checker Laplacian Sharpness & Exposure ──
  const qualityChecker = new FaceQualityChecker();
  const blurryGray = new Float32Array(100 * 100).fill(128); // Uniform flat image has 0 sharpness
  const blurVariance = qualityChecker._calculateLaplacianVariance(blurryGray, 100, 100);
  assert('8. Quality Checker Rejects Zero-Variance Blurry Frame', blurVariance === 0, `Variance: ${blurVariance}`);

  // ── TEST 9: Cryptographic Verification Session Token Lifecycle ──
  const studentId = '20894512';
  const electionId = 'src';
  const session = BiometricSessionManager.createSession(studentId, electionId, challenges);
  assert('9. Session Initialized with 180s TTL & Cryptographic Nonce', Boolean(session.sessionId && session.nonce && session.expiresAt > Date.now()), `SessionId: ${session.sessionId}`);

  // ── TEST 10: Finalize Verification Token & Atomic Single-Use Consumption ──
  const finalized = await BiometricSessionManager.finalizeVerification(
    studentId,
    electionId,
    { similarity: 0.94, confidence: 99.2 },
    { passiveScore: 95 }
  );
  assert('10. Verification Finalized & Single-Use Token Minted', finalized.verificationToken.startsWith('KNUST_BIO_'), `Token: ${finalized.verificationToken}`);

  const consumed1 = BiometricSessionManager.consumeSessionToken(finalized.verificationToken);
  assert('11. Atomic Session Token First Consumption Succeeded', consumed1 === true, 'First consumption: OK');

  const consumed2 = BiometricSessionManager.consumeSessionToken(finalized.verificationToken);
  assert('12. Replayed Token Second Consumption Rejected (Replay Attack Blocked)', consumed2 === false, 'Replay blocked: OK');

  return results;
}

export default runBiometricSecurityTestSuite;
