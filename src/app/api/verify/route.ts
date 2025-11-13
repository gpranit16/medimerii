import { NextRequest, NextResponse } from 'next/server'
import { hashImage, hammingDistance } from '@/lib/imageHash'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Compute hash of uploaded image
    const uploadedHash = await hashImage(buffer)

    // Get secret hash from environment
    const secretHash = process.env.SECRET_IMAGE_HASH || '952e1a796a786963'
    const threshold = parseInt(process.env.HASH_THRESHOLD || '10', 10)

    // Calculate hamming distance
    const difference = hammingDistance(uploadedHash, secretHash)

    console.log('Uploaded hash:', uploadedHash)
    console.log('Secret hash:', secretHash)
    console.log('Difference:', difference)
    console.log('Threshold:', threshold)

    // Check if hashes match within threshold
    if (difference <= threshold) {
      const secretCode = process.env.SECRET_MORSE_CODE || '....- ..... -....'
      return NextResponse.json({
        success: true,
        message: '✅ Correct MRI found!',
        secretCode,
        difference,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Wrong MRI. Try again!',
        difference,
      })
    }
  } catch (error) {
    console.error('Error processing image:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing image. Check server logs.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
