'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lang } from '@/shared/i18n/dict'

const VOICE_LANG: Record<Lang, string> = { es: 'es-US', en: 'en-US' }

/**
 * Lectura en voz alta (text-to-speech) con la Web Speech API.
 * Clave para adultos mayores: el examen es oral y muchos prefieren escuchar.
 */
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const supportedRef = useRef(false)

  useEffect(() => {
    supportedRef.current = typeof window !== 'undefined' && 'speechSynthesis' in window
    return () => {
      if (supportedRef.current) window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string, lang: Lang, rate = 0.9) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = VOICE_LANG[lang]
      u.rate = rate // un poco más lento, más claro para 65+
      const match = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(lang))
      if (match) u.voice = match
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      setSpeaking(true)
      window.speechSynthesis.speak(u)
    },
    [],
  )

  return { speak, stop, speaking, supported: supportedRef.current }
}
