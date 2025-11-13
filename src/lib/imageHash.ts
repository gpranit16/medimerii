import sharp from 'sharp'
import { Buffer } from 'node:buffer'

/**
 * Compute perceptual hash (pHash) of an image
 * This mimics the Python imagehash.phash() function
 */
export async function hashImage(imageBuffer: Buffer): Promise<string> {
  try {
    // Resize to 32x32 and convert to grayscale
    const resized = await sharp(imageBuffer)
      .resize(32, 32, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer()

    // Convert to 2D array
    const pixels: number[][] = []
    for (let i = 0; i < 32; i++) {
      pixels[i] = []
      for (let j = 0; j < 32; j++) {
        pixels[i][j] = resized[i * 32 + j]
      }
    }

    // Apply DCT (Discrete Cosine Transform)
    const dct = computeDCT(pixels)

    // Extract top-left 8x8 (excluding DC component at 0,0)
  const dctLowFreq: number[] = []
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (i !== 0 || j !== 0) {
          dctLowFreq.push(dct[i][j])
        }
      }
    }

    // Calculate median
    const sorted = [...dctLowFreq].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]

    // Generate hash: 1 if above median, 0 otherwise
    let hash = ''
    let isFirst = true
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (isFirst) {
          // Match python imagehash behaviour: DC component is ignored by forcing bit 0
          hash += '0'
          isFirst = false
          continue
        }
        hash += dct[i][j] > median ? '1' : '0'
      }
    }

    // Convert binary to hex
    return binaryToHex(hash)
  } catch (error) {
    console.error('Error hashing image:', error)
    throw error
  }
}

/**
 * Simple 2D DCT implementation
 */
function computeDCT(pixels: number[][]): number[][] {
  const N = pixels.length
  const dct: number[][] = Array(N)
    .fill(0)
    .map(() => Array(N).fill(0))

  for (let u = 0; u < N; u++) {
    for (let v = 0; v < N; v++) {
      let sum = 0
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          sum +=
            pixels[i][j] *
            Math.cos(((2 * i + 1) * u * Math.PI) / (2 * N)) *
            Math.cos(((2 * j + 1) * v * Math.PI) / (2 * N))
        }
      }
      const cu = u === 0 ? 1 / Math.sqrt(2) : 1
      const cv = v === 0 ? 1 / Math.sqrt(2) : 1
      dct[u][v] = (2 / N) * cu * cv * sum
    }
  }

  return dct
}

/**
 * Convert binary string to hexadecimal
 */
function binaryToHex(binary: string): string {
  let hex = ''
  for (let i = 0; i < binary.length; i += 4) {
    const chunk = binary.substr(i, 4).padEnd(4, '0')
    hex += parseInt(chunk, 2).toString(16)
  }
  return hex
}

/**
 * Calculate Hamming distance between two hex hashes
 */
export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) {
    throw new Error('Hashes must be of equal length')
  }

  let distance = 0
  for (let i = 0; i < hash1.length; i++) {
    const xor = parseInt(hash1[i], 16) ^ parseInt(hash2[i], 16)
    // Count number of 1s in binary representation
    distance += xor.toString(2).split('1').length - 1
  }

  return distance
}
