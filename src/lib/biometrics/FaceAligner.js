// src/lib/biometrics/FaceAligner.js
// Standardizes facial orientation and scale via 2D affine transformation to a canonical 112x112 space.

export class FaceAligner {
  constructor(options = {}) {
    this.outputSize = options.outputSize || 112; // Standard canonical size: 112x112
    this.targetLeftEye = options.targetLeftEye || [0.35, 0.38];  // Normalized coordinates in canonical crop
    this.targetRightEye = options.targetRightEye || [0.65, 0.38];
  }

  /**
   * Aligns, deskews, and normalizes a face region into canonical 112x112 format
   * @param {HTMLVideoElement|HTMLCanvasElement|ImageData} source - Source image
   * @param {Object} faceDetection - Bounding box and landmarks
   * @returns {ImageData|null} Normalized, aligned 112x112 ImageData
   */
  align(source, faceDetection) {
    if (!source || !faceDetection || !faceDetection.landmarks) {
      return null;
    }

    const { leftEye, rightEye } = faceDetection.landmarks;
    if (!leftEye?.center || !rightEye?.center) {
      return null;
    }

    const [lx, ly] = leftEye.center;
    const [rx, ry] = rightEye.center;

    // 1. Calculate eye angle (roll) and distance
    const dx = rx - lx;
    const dy = ry - ly;
    const eyeDist = Math.hypot(dx, dy);
    const angleRad = Math.atan2(dy, dx);

    // 2. Desired inter-pupillary distance in canonical crop
    const targetDist = this.outputSize * (this.targetRightEye[0] - this.targetLeftEye[0]);
    const scale = targetDist / (eyeDist || 1);

    // 3. Eye center in source
    const eyeCenterX = (lx + rx) / 2;
    const eyeCenterY = (ly + ry) / 2;

    // 4. Target eye center in canonical output
    const targetCenterX = this.outputSize * 0.5;
    const targetCenterY = this.outputSize * this.targetLeftEye[1];

    // 5. Render onto canonical alignment canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.outputSize;
    canvas.height = this.outputSize;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    ctx.save();
    // Translate target center to origin
    ctx.translate(targetCenterX, targetCenterY);
    // Rotate to counteract face roll angle
    ctx.rotate(-angleRad);
    // Scale to canonical IPD
    ctx.scale(scale, scale);
    // Translate source center to origin
    ctx.translate(-eyeCenterX, -eyeCenterY);

    if (source instanceof ImageData) {
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = source.width;
      srcCanvas.height = source.height;
      const srcCtx = srcCanvas.getContext('2d');
      srcCtx.putImageData(source, 0, 0);
      ctx.drawImage(srcCanvas, 0, 0);
    } else {
      ctx.drawImage(source, 0, 0);
    }
    ctx.restore();

    // 6. Extract aligned pixel data and perform illumination normalization
    const alignedImageData = ctx.getImageData(0, 0, this.outputSize, this.outputSize);
    this._normalizeIllumination(alignedImageData);

    return alignedImageData;
  }

  /**
   * Applies local contrast normalization (histogram equalization) to minimize lighting variations
   */
  _normalizeIllumination(imageData) {
    const { data, width, height } = imageData;
    const totalPixels = width * height;

    // Calculate luminance histogram
    const hist = new Uint32Array(256);
    const lum = new Uint8Array(totalPixels);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const y = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      lum[p] = y;
      hist[y]++;
    }

    // Cumulative distribution function (CDF)
    const cdf = new Uint32Array(256);
    cdf[0] = hist[0];
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + hist[i];
    }

    // Normalize using CDF mapping
    const minCdf = cdf.find(val => val > 0) || 1;
    const denom = totalPixels - minCdf || 1;

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const oldY = lum[p];
      const newY = Math.round(((cdf[oldY] - minCdf) / denom) * 255);
      const factor = oldY > 0 ? newY / oldY : 1;

      data[i] = Math.min(255, Math.max(0, Math.round(data[i] * factor)));
      data[i + 1] = Math.min(255, Math.max(0, Math.round(data[i + 1] * factor)));
      data[i + 2] = Math.min(255, Math.max(0, Math.round(data[i + 2] * factor)));
    }
  }
}

export default FaceAligner;
