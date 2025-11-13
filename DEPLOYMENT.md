# MEDIVERSE MRI Challenge - Deployment Guide

## 🚀 Quick Deploy

### Deploy to Vercel (Recommended)

1. Push code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Import from GitHub: `gpranit16/medimerii`
5. **IMPORTANT**: Add Environment Variables:
   ```
   SECRET_MORSE_CODE=....- ..... -....
   SECRET_IMAGE_HASH=952e1e796a386163
   HASH_THRESHOLD=10
   ```
6. Click Deploy

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. New site from Git → Choose `gpranit16/medimerii`
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add Environment Variables (same as above)
5. Deploy

### Environment Variables Required

**CRITICAL**: These must be set in your deployment platform:

```env
SECRET_MORSE_CODE=....- ..... -....
SECRET_IMAGE_HASH=952e1e796a386163
HASH_THRESHOLD=10
```

## 🧪 Testing

**Correct Image**: `tumor.jpg` (hash difference: 0)
**Expected Output**: "SURVIVED!" + Morse code revealed

## 🔧 Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 📝 How It Works

1. User uploads MRI scan
2. Server computes perceptual hash (pHash)
3. Compares with secret hash of tumor.jpg
4. If Hamming distance ≤ 10 → Success + reveal code
5. Otherwise → Failure

## 🎨 Features

- Squid Game theme
- Drag & drop upload
- Perceptual hash verification
- Morse code audio playback
- Reset functionality

## 🔐 Security

- Hash stored securely in environment variables
- One-way verification (cannot reverse engineer image)
- Threshold-based similarity matching

## 📦 Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Sharp (image processing)
- Web Audio API (Morse playback)

## 🐛 Troubleshooting

**Verification fails after deployment:**
- Check environment variables are set correctly
- Ensure `SECRET_IMAGE_HASH=952e1e796a386163`
- Verify threshold is set to `10`

**Build fails:**
- Clear cache: `rm -rf .next`
- Reinstall: `npm install`
- Build: `npm run build`

## 📧 Support

For issues, check the server logs or open an issue on GitHub.

---

**Live Demo**: [Your Deployment URL]
**Repository**: https://github.com/gpranit16/medimerii
