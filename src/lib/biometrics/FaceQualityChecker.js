// src/lib/biometrics/FaceQualityChecker.js
// Evaluates frame sharpness (Laplacian variance), luminance histogram, contrast,
// face scale, and head pose angles to ensure reliable biometric comparison.

export class FaceQualityChecker {
  constructor(config = {}) {
    this.minSharpness = config.minSharpness || 45;      // Laplacian variance threshold
    this.minBrightness = config.minBrightness || 40;    // Mean luminance minimum (0-255)
    this.maxBrightness = config.maxBrightness || 220;   // Mean luminance maximum (0-255)
    this.minContrast = config.minContrast || 25;        // Standard deviation of luminance
    this.minFaceRatio = config.minFaceRatio || 0.08;    // Minimum face area / frame area
    this.maxFaceRatio = config.maxFaceRatio || 0.75;    // Maximum face area / frame area
    this.maxYaw = config.maxYaw || 22;                  // Max allowable head turn degrees for frontal match
    this.maxPitch = config.maxPitch || 20;              // Max allowable head tilt degrees
    this.maxRoll = config.maxRoll || 18;                // Max allowable head roll degrees
  }

  /**
   * Evaluates image quality for an extracted face region
   * @param {ImageData|HTMLCanvasElement} faceImageData - Crop of the face
   * @param {Object} faceDetection - Bounding box and landmarks from FaceDetector
   * @param {number} frameWidth - Total video/camera frame width
   * @param {number} frameHeight - Total video/camera frame height
   * @returns {Object} Quality assessment report with diagnostic feedback
   */
  evaluate(faceImageData, faceDetection, frameWidth, frameHeight) {
    if (!faceImageData || !faceDetection) {
      return {
        passed: false,
        score: 0,
        reason: 'NO_FACE_REGION',
        feedback: 'Position your face inside the camera frame.',
        metrics: {}
      };
    }

    const { data, width, height } = faceImageData;
    const grayscale = this._toGrayscale(data, width, height);

    // 1. Calculate Sharpness via Laplacian operator variance
    const sharpness = this._calculateLaplacianVariance(grayscale, width, height);

    // 2. Calculate Luminance & Contrast
    const { meanLuminance, contrast } = this._calculateLuminanceAndContrast(grayscale);

    // 3. Face Scale & Positioning
    const faceBox = faceDetection.box;
    const faceAreaRatio = (faceBox.width * faceBox.height) / ((frameWidth * frameHeight) || 1);

    // 4. Head Pose
    const pose = faceDetection.landmarks?.pose || { yaw: 0, pitch: 0, roll: 0 };
    const absYaw = Math.abs(pose.yaw);
    const absPitch = Math.abs(pose.pitch);
    const absRoll = Math.abs(pose.roll);

    // Diagnostic validation checks
    const failures = [];
    let feedback = 'Hold steady, analyzing biometric features...';

    if (faceAreaRatio < this.minFaceRatio) {
      failures.push('FACE_TOO_SMALL');
      feedback = 'Move closer to the camera.';
    } else if (faceAreaRatio > this.maxFaceRatio) {
      failures.push('FACE_TOO_LARGE');
      feedback = 'Move slightly farther back.';
    }

    if (meanLuminance < this.minBrightness) {
      failures.push('TOO_DARK');
      feedback = 'Move into better lighting.';
    } else if (meanLuminance > this.maxBrightness) {
      failures.push('TOO_BRIGHT');
      feedback = 'Reduce glare or bright backlighting.';
    }

    if (contrast < this.minContrast) {
      failures.push('LOW_CONTRAST');
      feedback = 'Adjust lighting to improve face contrast.';
    }

    if (sharpness < this.minSharpness) {
      failures.push('BLURRY_FRAME');
      feedback = 'Hold still and ensure camera lens is clean.';
    }

    if (absYaw > this.maxYaw || absPitch > this.maxPitch || absRoll > this.maxRoll) {
      failures.push('EXCESSIVE_POSE_ANGLE');
      feedback = 'Look directly at the center of the camera.';
    }

    // Compute composite quality score (0 - 100)
    const sharpnessScore = Math.min(100, (sharpness / 120) * 100);
    const lightingScore = Math.max(0, 100 - Math.abs(meanLuminance - 128) * 1.1);
    const contrastScore = Math.min(100, (contrast / 50) * 100);
    const poseScore = Math.max(0, 100 - (absYaw * 2 + absPitch * 2 + absRoll * 2));
    const scaleScore = Math.max(0, 100 - Math.abs(faceAreaRatio - 0.35) * 200);

    const compositeScore = Math.round(
      sharpnessScore * 0.30 +
      lightingScore * 0.25 +
      contrastScore * 0.15 +
      poseScore * 0.20 +
      scaleScore * 0.10
    );

    const passed = failures.length === 0 && compositeScore >= 60;

    return {
      passed,
      score: compositeScore,
      reason: failures[0] || null,
      feedback: passed ? 'Good frame quality. Hold still.' : feedback,
      metrics: {
        sharpness: Math.round(sharpness * 10) / 10,
        luminance: Math.round(meanLuminance),
        contrast: Math.round(contrast),
        faceAreaRatio: Math.round(faceAreaRatio * 1000) / 1000,
        pose
      }
    };
  }

  _toGrayscale(data, width, height) {
    const gray = new Float32Array(width * height);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    return gray;
  }

  /**
   * Computes discrete 3x3 Laplacian operator variance: \sigma^2(\nabla^2 I)
   */
  _calculateLaplacianVariance(gray, width, height) {
    if (width < 3 || height < 3) return 0;

    let sum = 0;
    let sumSq = 0;
    let count = 0;

    // Laplacian kernel: [0, 1, 0], [1, -4, 1], [0, 1, 0]
    for (let y = 1; y < height - 1; y++) {
      const rowOffset = y * width;
      for (let x = 1; x < width - 1; x++) {
        const val =
          gray[rowOffset - width + x] +
          gray[rowOffset + width + x] +
          gray[rowOffset + x - 1] +
          gray[rowOffset + x + 1] -
          4 * gray[rowOffset + x];

        sum += val;
        sumSq += val * val;
        count++;
      }
    }

    if (count === 0) return 0;
    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);
    return Math.max(0, variance);
  }

  _calculateLuminanceAndContrast(gray) {
    let sum = 0;
    let sumSq = 0;
    const len = gray.length;

    for (let i = 0; i < len; i++) {
      const v = gray[i];
      sum += v;
      sumSq += v * v;
    }

    const meanLuminance = len > 0 ? sum / len : 0;
    const variance = len > 0 ? (sumSq / len) - (meanLuminance * meanLuminance) : 0;
    const contrast = Math.sqrt(Math.max(0, variance));

    return { meanLuminance, contrast };
  }
}

export default FaceQualityChecker;
