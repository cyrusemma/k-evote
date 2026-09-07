// src/lib/biometrics/FaceEmbedder.js
// Generates L2-normalized 128-dimensional biometric embedding vectors from 112x112 aligned face crops.
// Utilizes multi-block Local Binary Patterns (MB-LBP) and spatial frequency Gabor responses across 16 facial zones.

export class FaceEmbedder {
  constructor(options = {}) {
    this.vectorDim = 128; // Standard 128-d embedding
    this.gridSize = 4;    // 4x4 spatial subdivision (16 zones)
    this.gaborAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4]; // 4 orientations
  }

  /**
   * Generates a normalized 128-dimensional biometric embedding vector
   * @param {ImageData} alignedFaceImageData - 112x112 aligned face
   * @returns {Float32Array|null} 128-dimensional normalized embedding
   */
  generateEmbedding(alignedFaceImageData) {
    if (!alignedFaceImageData || alignedFaceImageData.width !== 112 || alignedFaceImageData.height !== 112) {
      return null;
    }

    const { data, width, height } = alignedFaceImageData;
    const grayscale = new Float32Array(width * height);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      grayscale[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    const rawFeatures = new Float32Array(this.vectorDim);
    let featIdx = 0;

    // 1. Extract Multi-Block Local Binary Pattern (MB-LBP) Histograms across 16 sub-regions (4x4 grid)
    const blockWidth = Math.floor(width / this.gridSize);   // 28px
    const blockHeight = Math.floor(height / this.gridSize); // 28px

    for (let gy = 0; gy < this.gridSize; gy++) {
      for (let gx = 0; gx < this.gridSize; gx++) {
        const startX = gx * blockWidth;
        const startY = gy * blockHeight;

        // Extract 4 dominant LBP feature components per region (16 * 4 = 64 features)
        const lbpStats = this._computeBlockLBP(grayscale, width, startX, startY, blockWidth, blockHeight);
        rawFeatures[featIdx++] = lbpStats.uniformPatterns;
        rawFeatures[featIdx++] = lbpStats.edgeDensity;
        rawFeatures[featIdx++] = lbpStats.spotDensity;
        rawFeatures[featIdx++] = lbpStats.meanIntensity;
      }
    }

    // 2. Extract Multi-Orientation Spatial Frequency Gabor Energy across 16 sub-regions (16 * 4 = 64 features)
    for (let gy = 0; gy < this.gridSize; gy++) {
      for (let gx = 0; gx < this.gridSize; gx++) {
        const startX = gx * blockWidth;
        const startY = gy * blockHeight;

        for (const angle of this.gaborAngles) {
          const energy = this._computeGaborEnergy(grayscale, width, startX, startY, blockWidth, blockHeight, angle);
          if (featIdx < this.vectorDim) {
            rawFeatures[featIdx++] = energy;
          }
        }
      }
    }

    // 3. L2 Normalization to unit sphere: ||e||_2 = 1.0
    return this.normalizeL2(rawFeatures);
  }

  /**
   * Computes LBP statistics for a local facial block
   */
  _computeBlockLBP(gray, imgWidth, startX, startY, bWidth, bHeight) {
    let uniformCount = 0;
    let edgeCount = 0;
    let spotCount = 0;
    let intensitySum = 0;
    let totalPixels = 0;

    for (let y = startY + 1; y < startY + bHeight - 1; y++) {
      const rowOffset = y * imgWidth;
      for (let x = startX + 1; x < startX + bWidth - 1; x++) {
        const center = gray[rowOffset + x];
        intensitySum += center;
        totalPixels++;

        // 8-neighbor comparison
        let code = 0;
        if (gray[rowOffset - imgWidth + x - 1] >= center) code |= 1;
        if (gray[rowOffset - imgWidth + x] >= center) code |= 2;
        if (gray[rowOffset - imgWidth + x + 1] >= center) code |= 4;
        if (gray[rowOffset + x + 1] >= center) code |= 8;
        if (gray[rowOffset + imgWidth + x + 1] >= center) code |= 16;
        if (gray[rowOffset + imgWidth + x] >= center) code |= 32;
        if (gray[rowOffset + imgWidth + x - 1] >= center) code |= 64;
        if (gray[rowOffset + x - 1] >= center) code |= 128;

        // Bit transitions for uniformity
        let transitions = 0;
        for (let b = 0; b < 8; b++) {
          const b1 = (code >> b) & 1;
          const b2 = (code >> ((b + 1) % 8)) & 1;
          if (b1 !== b2) transitions++;
        }

        if (transitions <= 2) uniformCount++;
        if (code === 0 || code === 255) spotCount++;
        if (transitions > 2 && transitions <= 4) edgeCount++;
      }
    }

    const n = totalPixels || 1;
    return {
      uniformPatterns: uniformCount / n,
      edgeDensity: edgeCount / n,
      spotDensity: spotCount / n,
      meanIntensity: (intensitySum / n) / 255.0
    };
  }

  /**
   * Computes Gabor filter response energy at a given orientation
   */
  _computeGaborEnergy(gray, imgWidth, startX, startY, bWidth, bHeight, theta) {
    const wavelength = 6.0;
    const sigma = 3.0;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    let realEnergy = 0;
    let count = 0;

    for (let y = startY; y < startY + bHeight; y += 2) {
      const rowOffset = y * imgWidth;
      for (let x = startX; x < startX + bWidth; x += 2) {
        const px = x - (startX + bWidth / 2);
        const py = y - (startY + bHeight / 2);

        const xPrime = px * cosTheta + py * sinTheta;
        const yPrime = -px * sinTheta + py * cosTheta;

        const gaussian = Math.exp(-(xPrime * xPrime + yPrime * yPrime) / (2 * sigma * sigma));
        const wave = Math.cos((2 * Math.PI * xPrime) / wavelength);

        realEnergy += gray[rowOffset + x] * gaussian * wave;
        count++;
      }
    }

    return count > 0 ? (realEnergy / count) / 128.0 : 0;
  }

  /**
   * L2 Vector Normalization: v / ||v||_2
   */
  normalizeL2(vector) {
    let sumSq = 0;
    for (let i = 0; i < vector.length; i++) {
      sumSq += vector[i] * vector[i];
    }

    const norm = Math.sqrt(sumSq) || 1e-12;
    const normalized = new Float32Array(vector.length);
    for (let i = 0; i < vector.length; i++) {
      normalized[i] = vector[i] / norm;
    }

    return normalized;
  }
}

export default FaceEmbedder;
