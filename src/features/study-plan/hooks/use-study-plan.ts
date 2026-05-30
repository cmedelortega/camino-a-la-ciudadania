'use client'

import { useCallback, useEffect, useState } from 'react'
import type { DeckId } from '../lib/generate-plan'

const KEY = 'civics.studyplan.v1'

interface PlanConfig {
  deck: DeckId
  weeks: number
  /** Números de semana marcados como completados. */
  completed: number[]
}

const DEFAULTS: PlanConfig = { deck: 'all', weeks: 6, completed: [] }

/** Config del plan de estudio (mazo, semanas, semanas completadas) persistida en el navegador. */
export function useStudyPlan() {
  const [config, setConfig] = useState<PlanConfig>(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setConfig({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch {
      /* ignora */
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(KEY, JSON.stringify(config))
    } catch {
      /* ignora */
    }
  }, [config, loaded])

  // Cambiar mazo o número de semanas reinicia el avance (el plan cambia).
  const setDeck = useCallback((deck: DeckId) => setConfig((c) => ({ ...c, deck, completed: [] })), [])
  const setWeeks = useCallback((weeks: number) => setConfig((c) => ({ ...c, weeks, completed: [] })), [])
  const toggleWeek = useCallback(
    (week: number) =>
      setConfig((c) => ({
        ...c,
        completed: c.completed.includes(week) ? c.completed.filter((w) => w !== week) : [...c.completed, week],
      })),
    [],
  )

  /** Aplica una sugerencia inicial (desde el perfil de elegibilidad) una sola vez. */
  const applySuggestion = useCallback((deck: DeckId, weeks: number) => {
    setConfig((c) => ({ ...c, deck, weeks, completed: [] }))
  }, [])

  return { ...config, loaded, setDeck, setWeeks, toggleWeek, applySuggestion }
}
