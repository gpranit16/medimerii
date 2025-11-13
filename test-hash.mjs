// Test script to verify the hash computation matches the expected value
import { hashImage, hammingDistance } from './src/lib/imageHash.js'
import { readFileSync } from 'fs'
import { join } from 'path'

async function testHash() {
  console.log('Testing perceptual hash computation...\n')
  
  // Load the tumor.jpg image
  const imagePath = join(process.cwd(), '..', 'dataset', 'tumor.jpg')
  console.log('Loading image from:', imagePath)
  
  try {
    const imageBuffer = readFileSync(imagePath)
    console.log('✓ Image loaded successfully\n')
    
    // Compute hash
    const computedHash = await hashImage(imageBuffer)
    console.log('Computed hash:', computedHash)
    
    // Expected hash from the Python code
    const expectedHash = '952e1a796a786963'
    console.log('Expected hash:', expectedHash)
    
    // Calculate difference
    const difference = hammingDistance(computedHash, expectedHash)
    console.log('\nHamming distance:', difference)
    
    // Check if it passes the threshold
    const threshold = 10
    if (difference <= threshold) {
      console.log('✓ Hash matches! (within threshold of', threshold + ')')
      console.log('\n🎉 Secret code would be revealed: ....- ..... -....')
    } else {
      console.log('✗ Hash does not match (difference:', difference, '> threshold:', threshold + ')')
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testHash()
