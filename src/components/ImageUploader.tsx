'use client'

import { useCallback, useState, useEffect } from 'react'

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
  isLoading: boolean
  resetTrigger?: number
}

export default function ImageUploader({ onImageUpload, isLoading, resetTrigger }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  // Reset preview when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setPreview(null)
    }
  }, [resetTrigger])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files[0]) {
        handleFile(files[0])
      }
    },
    [onImageUpload]
  )

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-4 border-dashed rounded-lg p-12 text-center transition-all shadow-2xl ${
          isDragging
            ? 'border-pink-400 bg-pink-900 bg-opacity-40 shadow-pink-500/50 scale-105'
            : 'border-pink-500 bg-black bg-opacity-70'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isLoading}
        />
        
        {preview ? (
          <div className="space-y-4">
            <div className="border-4 border-pink-400 rounded-lg overflow-hidden shadow-xl shadow-pink-500/50 inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto"
              />
            </div>
            <p className="text-pink-300 font-bold text-lg">✓ SCAN UPLOADED</p>
            <p className="text-pink-200 text-sm">Awaiting verification...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-8xl animate-pulse">🏥</div>
            <div className="bg-pink-900 bg-opacity-50 p-6 rounded-lg border-2 border-pink-400">
              <p className="text-2xl text-pink-100 mb-3 font-bold">
                DROP YOUR MRI SCAN HERE
              </p>
              <p className="text-pink-300 mb-4 text-lg">OR</p>
              <label
                htmlFor="fileInput"
                className="inline-block px-8 py-4 bg-pink-600 text-white text-lg font-bold rounded-lg cursor-pointer hover:bg-pink-700 transition-all active:scale-95 border-2 border-pink-400 shadow-lg shadow-pink-500/50"
              >
                📁 SELECT FILE
              </label>
            </div>
            <p className="text-sm text-pink-300 font-semibold">
              ⚠️ Supported: JPG, PNG, JPEG ⚠️
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
