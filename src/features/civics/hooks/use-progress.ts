'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ExamAttempt, MasteryStatus, QuestionProgress } from '../types'

const PROGRESS_KEY = 'civics.progress.v1'
const ATTEMPTS_KEY = 'civics.attempts.v1'

interface ProgressState {
  byQuestion: Record<number, QuestionProgress>
  attempts: ExamAttempt[]
}

function load(): ProgressState {
  if (typeof window === 'undefined') return { byQuestion: {}, attempts: [] }
  try {
    const byQuestion = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}')
    const attempts = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) ?? '[]')
    return { byQuestion, attempts }
  } catch {
    return { byQuestion: {}, attempts: [] }
  }
}

/** Progreso de estudio y exámenes, persistido en el navegador (sin cuenta requerida). */
export function useProgress() {
  const [state, setState] = useState<ProgressState>({ byQuestion: {}, attempts: [] })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setState(load())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.byQuestion))
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(state.attempts))
    } catch {
      /* ignora */
    }
  }, [state, loaded])

  /** Registra que una pregunta fue vista y si se contestó bien. */
  const recordSeen = useCallback((questionId: number, correct: boolean) => {
    setState((s) => {
      const prev = s.byQuestion[questionId]
      const timesCorrect = (prev?.timesCorrect ?? 0) + (correct ? 1 : 0)
      const timesSeen = (prev?.timesSeen ?? 0) + 1
      let status: MasteryStatus = 'learning'
      if (correct && timesCorrect >= 2) status = 'mastered'
      else if (!correct) status = 'learning'
      return {
        ...s,
        byQuestion: {
          ...s.byQuestion,
          [questionId]: { questionId, status, timesCorrect, timesSeen, lastSeen: Date.now() },
        },
      }
    })
  }, [])

  const addAttempt = useCallback((attempt: ExamAttempt) => {
    setState((s) => ({ ...s, attempts: [attempt, ...s.attempts].slice(0, 20) }))
  }, [])

  const reset = useCallback(() => setState({ byQuestion: {}, attempts: [] }), [])

  const counts = (() => {
    const values = Object.values(state.byQuestion)
    return {
      mastered: values.filter((v) => v.status === 'mastered').length,
      learning: values.filter((v) => v.status === 'learning').length,
      seen: values.length,
    }
  })()

  return {
    loaded,
    byQuestion: state.byQuestion,
    attempts: state.attempts,
    counts,
    recordSeen,
    addAttempt,
    reset,
  }
}
