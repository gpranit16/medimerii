'use client'

import { useState, useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import { playMorseCode } from '@/lib/morseAudio'

export default function Home() {
  const [result, setResult] = useState<{
    success: boolean
    message: string
    secretCode?: string
    difference?: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Error verifying image. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handlePlayMorse = useCallback(() => {
    if (!result?.secretCode || isPlaying) return
    
    setIsPlaying(true)
    playMorseCode(result.secretCode)
    
    // Estimate duration and reset playing state
    // Each character takes roughly 0.5-1 second
    const estimatedDuration = result.secretCode.length * 500
    setTimeout(() => setIsPlaying(false), estimatedDuration)
  }, [result, isPlaying])

  const handleReset = useCallback(() => {
    setResult(null)
    setIsPlaying(false)
    setResetKey(prev => prev + 1) // Trigger reset in ImageUploader
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-600 via-pink-700 to-black">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 text-8xl animate-bounce">🦑</div>
          <h1 className="text-6xl font-bold text-center mb-2 text-white drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]" style={{ fontFamily: 'Impact, sans-serif' }}>
            🧠 MEDIVERSE MRI CHALLENGE
          </h1>
          <div className="mt-4 p-3 bg-black bg-opacity-60 border-4 border-pink-500 rounded-lg inline-block">
            <p className="text-pink-300 font-bold text-lg">⚠️ GAME #{Math.floor(Math.random() * 456) + 1}</p>
          </div>
        </div>
        <p className="text-center text-pink-100 mb-8 text-lg font-semibold">
          Upload the correct MRI scan to survive and reveal the secret code
        </p>

        <ImageUploader 
          onImageUpload={handleImageUpload} 
          isLoading={isLoading} 
          resetTrigger={resetKey}
        />

        {isLoading && (
          <div className="mt-8 text-center p-8 bg-black bg-opacity-70 border-4 border-pink-500 rounded-lg">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-400"></div>
            <p className="text-pink-300 mt-4 text-xl font-bold">⏳ VERIFYING SCAN...</p>
            <p className="text-pink-200 text-sm mt-2">Your fate is being decided...</p>
          </div>
        )}

        {result && !isLoading && (
          <div
            className={`mt-8 p-8 rounded-lg shadow-2xl border-4 ${
              result.success
                ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-400 shadow-green-500/50'
                : 'bg-gradient-to-br from-red-900 to-black border-red-500 shadow-red-500/50'
            }`}
          >
            <div className="flex items-center justify-center mb-6">
              {result.success ? (
                <div className="text-center">
                  <span className="text-8xl animate-pulse">✅</span>
                  <p className="text-green-300 font-bold text-2xl mt-2">SURVIVED!</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-8xl">❌</span>
                  <p className="text-red-300 font-bold text-2xl mt-2">ELIMINATED</p>
                </div>
              )}
            </div>
            <div className="bg-black bg-opacity-50 p-4 rounded border-2 border-white border-opacity-30">
              <p className="text-2xl text-center text-white font-bold mb-2">
                {result.message}
              </p>
            
              {result.difference !== undefined && (
                <p className="text-center text-gray-300 text-sm mb-4">
                  Hash difference: {result.difference}
                </p>
              )}
            </div>

            {result.success && result.secretCode && (
              <div className="mt-6 p-6 bg-gradient-to-br from-pink-900 to-pink-800 border-4 border-pink-400 rounded-lg shadow-2xl shadow-pink-500/50">
                <div className="bg-black bg-opacity-60 p-6 rounded-lg border-2 border-pink-300">
                  <p className="text-center text-pink-200 mb-3 text-xl font-bold">🏆 WINNER'S SECRET CODE 🏆</p>
                  <p className="morse-code text-center text-green-400 text-4xl tracking-wider">
                    {result.secretCode}
                  </p>
                  <p className="text-center text-pink-300 text-sm mt-4 font-semibold">
                    (Morse Code - 456 Million Won Prize)
                  </p>
                </div>
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    onClick={handlePlayMorse}
                    disabled={isPlaying}
                    className={`flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all text-lg shadow-lg ${
                      isPlaying
                        ? 'bg-gray-700 cursor-not-allowed border-2 border-gray-500'
                        : 'bg-pink-600 hover:bg-pink-700 active:scale-95 border-2 border-pink-400 hover:shadow-pink-500/50'
                    } text-white`}
                  >
                    {isPlaying ? (
                      <>
                        <span className="animate-pulse">🔊</span>
                        Playing...
                      </>
                    ) : (
                      <>
                        <span>▶️</span>
                        Play Morse Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="px-10 py-4 bg-black hover:bg-pink-900 text-pink-300 font-bold text-lg rounded-lg shadow-2xl transition-all active:scale-95 border-4 border-pink-500 hover:border-pink-400"
            >
              🔄 TRY ANOTHER SCAN
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
