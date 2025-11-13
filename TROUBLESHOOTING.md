# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: npm run dev fails with "ENOENT: no such file or directory, open 'package.json'"

**Cause:** Running the command from the wrong directory

**Solution:**
```bash
cd c:\Users\gupta\OneDrive\Documents\MRI_\MRI_Puzzle\mri-verification-website
npm run dev
```

Or use the batch file:
```bash
.\mri-verification-website\start.bat
```

---

### Issue 2: Port 3000 already in use

**Cause:** Another application is using port 3000

**Solution:**
```bash
# Option 1: Kill the process on port 3000
npx kill-port 3000

# Option 2: Use a different port
npm run dev -- -p 3001
```

---

### Issue 3: Image upload shows "Wrong MRI" even for correct image

**Cause:** Hash computation might differ or threshold too strict

**Solution:**

1. Check the console logs for hash values:
   ```
   Uploaded hash: xxxxxxxxxxxxxxxx
   Secret hash: 952e1a796a786963
   Difference: XX
   ```

2. If difference is close to threshold (10), increase it in `.env.local`:
   ```env
   HASH_THRESHOLD=15
   ```

3. Restart the server after changing .env.local

---

### Issue 4: "Cannot find module 'sharp'" error

**Cause:** Dependencies not installed properly

**Solution:**
```bash
cd mri-verification-website
npm install
```

---

### Issue 5: TypeScript errors about Buffer or process

**Cause:** Missing Node.js type definitions

**Solution:**
Already fixed in tsconfig.json, but if issues persist:
```bash
npm install --save-dev @types/node
```

---

### Issue 6: Image upload doesn't trigger anything

**Cause:** API route not responding or CORS issue

**Solution:**
1. Check browser console (F12) for errors
2. Verify API is accessible: http://localhost:3000/api/verify
3. Check server terminal for error messages

---

### Issue 7: Secret code not revealing even on success

**Cause:** Environment variable not loaded

**Solution:**
1. Verify `.env.local` exists in the root of `mri-verification-website/`
2. Restart the dev server (Ctrl+C, then `npm run dev`)
3. Check that SECRET_MORSE_CODE is set:
   ```env
   SECRET_MORSE_CODE=....- ..... -....
   ```

---

## How to Verify Everything is Working

### Step 1: Check Server Status
Terminal should show:
```
✓ Ready in X.Xs
```

### Step 2: Open Browser
Go to: http://localhost:3000

You should see:
- 🧠 MRI Verification System title
- Upload area with drag-and-drop zone

### Step 3: Upload Test Image
Upload `../dataset/tumor.jpg`

Expected result:
```
✅ Correct MRI found!
🔐 Secret Code: ....- ..... -....
```

---

## Debug Mode

To see detailed logs, check the terminal where `npm run dev` is running. Every upload will show:
```
Uploaded hash: xxxxxxxxxxxxxxxx
Secret hash: 952e1a796a786963
Difference: X
Threshold: 10
```

Use this to:
- Verify hash computation
- Check Hamming distance
- Debug threshold issues

---

## Reset Everything

If all else fails:
```bash
# Delete node_modules and reinstall
cd mri-verification-website
rmdir /s /q node_modules
del package-lock.json
npm install

# Start fresh
npm run dev
```

---

## Getting Help

If issues persist:
1. Check the terminal output for error messages
2. Check browser console (F12) for frontend errors
3. Verify all files are in place (see IMPLEMENTATION.md)
4. Ensure Node.js version is 18+ (`node --version`)

---

## Quick Health Check

Run this command to verify setup:
```bash
cd mri-verification-website
npm run build
```

If build succeeds, everything is configured correctly!
