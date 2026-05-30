'use client'

import { useCallback, useEffect, useState } from 'react'
import type { EligibilityInput } from '../types'

const KEY = 'civics.eligibility.v1'

/** Guarda y recupera el perfil de elegibilidad del usuario (sin cuenta). */
export function useEligibility() {
  const [input, setInputState] = useState<EligibilityInput | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setInputState(JSON.parse(raw))
    } catch {
      /* ignora */
    }
    setLoaded(true)
  }, [])

  const save = useCallback((value: EligibilityInput) => {
    setInputState(value)
    try {
      localStorage.setItem(KEY, JSON.stringify(value))
    } catch {
      /* ignora */
    }
  }, [])

  const clear = useCallback(() => {
    setInputState(null)
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignora */
    }
  }, [])

  return { input, save, clear, loaded }
}
