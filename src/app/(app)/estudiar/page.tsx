'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CivicsCategory } from '@/features/civics/types'
import { CIVICS_QUESTIONS_2025, QUESTIONS_6520 } from '@/features/civics/data/questions-2025'
import { Flashcard } from '@/features/civics/components/flashcard'
import { useProgress } from '@/features/civics/hooks/use-progress'
import { useSettings } from '@/shared/settings/settings-context'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'

type Deck = 'all' | '6520' | CivicsCategory

const CATEGORIES: CivicsCategory[] = [
  'principles', 'system', 'rights', 'colonial', '1800s', 'recent', 'symbols', 'holidays',
]
const CAT_KEY: Record<CivicsCategory, 'cat_principles' | 'cat_system' | 'cat_rights' | 'cat_colonial' | 'cat_1800s' | 'cat_recent' | 'cat_symbols' | 'cat_holidays'> = {
  principles: 'cat_principles',
  system: 'cat_system',
  rights: 'cat_rights',
  colonial: 'cat_colonial',
  '1800s': 'cat_1800s',
  recent: 'cat_recent',
  symbols: 'cat_symbols',
  holidays: 'cat_holidays',
}

export default function EstudiarPage() {
  const { t } = useSettings()
  const { recordSeen } = useProgress()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [index, setIndex] = useState(0)
  // Sesión enfocada desde el plan de estudio: /estudiar?ids=1,2,3
  const [focusIds, setFocusIds] = useState<number[] | null>(null)

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('ids')
    if (!raw) return
    const ids = raw.split(',').map(Number).filter((n) => Number.isFinite(n))
    if (ids.length) setFocusIds(ids)
  }, [])

  const questions = useMemo(() => {
    if (focusIds) {
      const order = new Map(focusIds.map((id, i) => [id, i]))
      return CIVICS_QUESTIONS_2025.filter((q) => order.has(q.id)).sort(
        (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
      )
    }
    if (deck === null) return []
    if (deck === 'all') return CIVICS_QUESTIONS_2025
    if (deck === '6520') return QUESTIONS_6520
    return CIVICS_QUESTIONS_2025.filter((q) => q.category === deck)
  }, [deck, focusIds])

  function exitSession() {
    setFocusIds(null)
    setDeck(null)
    setIndex(0)
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState(null, '', '/estudiar')
    }
  }

  if (deck === null && !focusIds) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">{t('chooseWhatToStudy')}</h1>
        <div className="grid gap-3">
          <Button big variant="primary" onClick={() => setDeck('all')}>
            📚 {t('studyAll')}
          </Button>
          <Button big variant="secondary" onClick={() => setDeck('6520')}>
            ★ {t('study6520')}
          </Button>
        </div>
        <h2 className="pt-2 text-xl font-semibold">{t('studyByCategory')}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <Button key={c} variant="ghost" className="justify-start" onClick={() => setDeck(c)}>
              {t(CAT_KEY[c])}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const q = questions[index]
  const atEnd = index >= questions.length - 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={exitSession}>
          ← {t('back')}
        </Button>
        <span className="text-base font-semibold text-slate-500">
          {t('questionOf', { n: index + 1, total: questions.length })}
        </span>
      </div>

      {q && (
        <Flashcard
          question={q}
          onRate={(correct) => {
            recordSeen(q.id, correct)
            if (!atEnd) setIndex((i) => i + 1)
          }}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          ← {t('previous')}
        </Button>
        <Button
          variant="secondary"
          disabled={atEnd}
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
        >
          {t('next')} →
        </Button>
      </div>

      {atEnd && (
        <Card className="text-center">
          <p className="text-lg font-semibold">✓ {t('mastered')}</p>
          <Button variant="primary" className="mt-3" onClick={exitSession}>
            {t('chooseWhatToStudy')}
          </Button>
        </Card>
      )}
    </div>
  )
}
