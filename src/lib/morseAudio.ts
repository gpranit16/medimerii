'use client'

// Morse code timing constants (in milliseconds)
const DOT_DURATION = 100
const DASH_DURATION = DOT_DURATION * 3
const SYMBOL_GAP = DOT_DURATION
const LETTER_GAP = DOT_DURATION * 3
const WORD_GAP = DOT_DURATION * 7

// Audio settings
const FREQUENCY = 600 // Hz

export function playMorseCode(morseCode: string) {
  if (typeof window === 'undefined' || !window.AudioContext) {
    console.error('Web Audio API not supported')
    return
  }

  const audioContext = new AudioContext()
  let currentTime = audioContext.currentTime

  // Parse and play each character
  const characters = morseCode.split(' ')
  
  characters.forEach((char, index) => {
    if (char === '') {
      // Space between words
      currentTime += WORD_GAP / 1000
      return
    }

    // Play each dot or dash
    for (let i = 0; i < char.length; i++) {
      const symbol = char[i]
      
      if (symbol === '.') {
        playTone(audioContext, currentTime, DOT_DURATION / 1000)
        currentTime += (DOT_DURATION + SYMBOL_GAP) / 1000
      } else if (symbol === '-') {
        playTone(audioContext, currentTime, DASH_DURATION / 1000)
        currentTime += (DASH_DURATION + SYMBOL_GAP) / 1000
      }
    }

    // Add letter gap (unless it's the last character)
    if (index < characters.length - 1) {
      currentTime += (LETTER_GAP - SYMBOL_GAP) / 1000
    }
  })

  return currentTime - audioContext.currentTime
}

function playTone(audioContext: AudioContext, startTime: number, duration: number) {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = FREQUENCY
  oscillator.type = 'sine'

  // Add slight fade in/out to avoid clicks
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
  gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.01)
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}
