# MRI Verification Website

A Next.js website that verifies uploaded MRI images using perceptual hashing and reveals a secret Morse code upon successful verification.

## Features

- 🖼️ Drag-and-drop image upload
- 🔐 Perceptual hash-based image verification
- 🎯 Reveals secret Morse code for correct images
- 💫 Beautiful, animated UI with Tailwind CSS
- ⚡ Built with Next.js 14 and TypeScript

## How It Works

The website uses **perceptual hashing (pHash)** to verify uploaded images against a secret reference image (`tumor.jpg`). The hash is computed using:

1. Resize image to 32x32 pixels
2. Convert to grayscale
3. Apply Discrete Cosine Transform (DCT)
4. Extract low-frequency components
5. Compare against median to generate binary hash
6. Calculate Hamming distance between hashes

If the uploaded image is similar enough to the reference image (within the threshold), the secret Morse code is revealed.

## Setup Instructions

### 1. Install Dependencies

```bash
cd mri-verification-website
npm install
```

### 2. Configure Environment Variables

The `.env.local` file is already set up with:

```env
SECRET_MORSE_CODE=....- ..... -....
SECRET_IMAGE_HASH=952e1a796a786963
HASH_THRESHOLD=10
```

- `SECRET_MORSE_CODE`: The Morse code to reveal (currently "456" in Morse)
- `SECRET_IMAGE_HASH`: Precomputed hash of `tumor.jpg`
- `HASH_THRESHOLD`: Maximum Hamming distance to accept (lower = stricter)

### 3. Run Development Server

**Option A: Using npm**
```bash
npm run dev
```

**Option B: Using the batch file (Windows)**
```bash
start.bat
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the Website

1. The website is now running at http://localhost:3000
2. Drag and drop the correct image (`tumor.jpg` from the parent `dataset` folder)
3. Or click "Browse Files" to upload it
4. If the image matches, you'll see the secret Morse code: `....- ..... -....` ✅

**Quick Test:**
Upload `../dataset/tumor.jpg` to see the success message and secret code revealed!

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
mri-verification-website/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── verify/
│   │   │       └── route.ts       # API endpoint for image verification
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   ├── components/
│   │   └── ImageUploader.tsx      # Drag-and-drop component
│   └── lib/
│       └── imageHash.ts           # Perceptual hashing implementation
├── .env.local                     # Environment variables (secret code & hash)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp
- **Hashing Algorithm**: Perceptual Hash (pHash)

## How to Change the Secret

1. **Change the reference image**: Replace `tumor.jpg` with your desired image
2. **Compute new hash**: Use the Python script or create a Node.js script to compute the pHash
3. **Update `.env.local`**: Change `SECRET_IMAGE_HASH` to the new hash value
4. **Update secret code**: Change `SECRET_MORSE_CODE` to your desired message

## Security Notes

- The secret image hash is stored in environment variables and not exposed to clients
- Only the hash comparison result is returned to the frontend
- The actual reference image is never sent to the client
- Perceptual hashing makes it difficult to reverse-engineer the original image

## License

MIT
