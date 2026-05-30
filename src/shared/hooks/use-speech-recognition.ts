'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lang } from '@/shared/i18n/dict'

const RECO_LANG: Record<Lang, string> = { es: 'es-US', en: 'en-US' }

// La Web Speech API de reconocimiento no está tipada en lib.dom estándar.
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/**
 * Reconocimiento de voz: el usuario contesta hablando, como en la entrevista real.
 * Devuelve el texto reconocido para comparar con las respuestas aceptables.
 */
export function useSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null)
    return () => recRef.current?.abort()
  }, [])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])

  const start = useCallback((lang: Lang) => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = RECO_LANG[lang]
    rec.interimResults = false
    rec.continuous = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? ''
      setTranscript(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    setTranscript('')
    setListening(true)
    rec.start()
  }, [])

  const reset = useCallback(() => setTranscript(''), [])

  return { start, stop, reset, listening, transcript, supported }
}

/** Normaliza texto para comparar respuestas (minúsculas, sin acentos ni puntuación). */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** ¿El texto hablado coincide con alguna respuesta aceptable? (coincidencia laxa) */
export function matchesAnswer(spoken: string, acceptable: string[]): boolean {
  const s = normalize(spoken)
  if (!s) return false
  return acceptable.some((a) => {
    const n = normalize(a.replace(/\([^)]*\)/g, '')) // quita aclaraciones entre paréntesis
    if (!n) return false
    return s.includes(n) || n.includes(s)
  })
}
