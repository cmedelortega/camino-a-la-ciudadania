'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { CivicsCategory } from '@/features/civics/types'
import type { UIKey } from '@/shared/i18n/dict'
import { generatePlan, weeksUntil, type DeckId, type StudyWeek } from '@/features/study-plan/lib/generate-plan'
import { useStudyPlan } from '@/features/study-plan/hooks/use-study-plan'
import { useEligibility } from '@/features/eligibility/hooks/use-eligibility'
import { evaluateEligibility, parseDate } from '@/features/eligibility/lib/evaluate'
import { useSettings } from '@/shared/settings/settings-context'
import { Card } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { cn } from '@/shared/lib/utils'

const WEEK_OPTIONS = [4, 6, 8, 12]
const CAT_KEY: Record<CivicsCategory, UIKey> = {
  principles: 'cat_principles',
  system: 'cat_system',
  rights: 'cat_rights',
  colonial: 'cat_colonial',
  '1800s': 'cat_1800s',
  recent: 'cat_recent',
  symbols: 'cat_symbols',
  holidays: 'cat_holidays',
}

export default function PlanPage() {
  const { t, lang } = useSettings()
  const { deck, weeks, completed, loaded, setDeck, setWeeks, toggleWeek, applySuggestion } = useStudyPlan()
  const { input } = useEligibility()

  const plan = useMemo(() => generatePlan(deck, weeks), [deck, weeks])

  // Sugerencia a partir del perfil de elegibilidad.
  const suggestion = useMemo(() => {
    if (!input) return null
    const r = evaluateEligibility(input)
    return {
      deck: (r.simplifiedCivics ? '6520' : 'all') as DeckId,
      weeks: weeksUntil(input.filingDate),
      filingDate: input.filingDate,
    }
  }, [input])

  if (!loaded) return null

  const doneCount = plan.weeks.filter((w) => completed.includes(w.week)).length

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">📆 {t('studyPlan')}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">{t('studyPlanDesc')}</p>
      </header>

      {/* Sugerencia del perfil o invitación a elegibilidad */}
      {suggestion ? (
        <Card className="space-y-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40">
          <p className="text-lg font-semibold">
            {t('planForDate', {
              date: parseDate(suggestion.filingDate).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            })}
          </p>
          <Button variant="primary" onClick={() => applySuggestion(suggestion.deck, suggestion.weeks)}>
            {t('planSuggested')}: {t('weeksValue', { n: suggestion.weeks })} ·{' '}
            {suggestion.deck === '6520' ? t('study6520') : t('studyAll')}
          </Button>
        </Card>
      ) : (
        <Card className="bg-amber-50 dark:bg-amber-950/40">
          <p className="text-base text-amber-800 dark:text-amber-200">
            💡 {t('noProfileHint')}{' '}
            <Link href="/elegibilidad" className="font-semibold underline">
              {t('eligibility')}
            </Link>
          </p>
        </Card>
      )}

      {/* Controles */}
      <Card className="space-y-4">
        <div>
          <p className="mb-2 font-semibold">{t('planWeeksLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {WEEK_OPTIONS.map((w) => (
              <button
                key={w}
                onClick={() => setWeeks(w)}
                className={cn(
                  'rounded-lg px-4 py-2 text-lg font-bold transition-all',
                  weeks === w
                    ? 'glass-sheen border border-blue-400/50 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'glass-pill text-slate-700 dark:text-slate-200',
                )}
                aria-pressed={weeks === w}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">{t('planDeckLabel')}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button variant={deck === 'all' ? 'primary' : 'secondary'} onClick={() => setDeck('all')}>
              📚 {t('studyAll')}
            </Button>
            <Button variant={deck === '6520' ? 'primary' : 'secondary'} onClick={() => setDeck('6520')}>
              ★ {t('study6520')}
            </Button>
          </div>
        </div>
        <p className="text-base font-semibold text-slate-500">
          {t('planProgress', { done: doneCount, total: plan.weeks.length })}
        </p>
      </Card>

      {/* Semanas */}
      <div className="space-y-3">
        {plan.weeks.map((w) => (
          <WeekCard
            key={w.week}
            week={w}
            done={completed.includes(w.week)}
            onToggle={() => toggleWeek(w.week)}
            catLabel={(c) => t(CAT_KEY[c])}
            t={t}
          />
        ))}
      </div>

      {/* Rutina diaria */}
      <Card className="space-y-2">
        <h2 className="text-xl font-bold">{t('dailyRoutineTitle')}</h2>
        <ul className="space-y-1 text-lg">
          <li>1. {t('routine1')}</li>
          <li>2. {t('routine2')}</li>
          <li>3. {t('routine3')}</li>
        </ul>
      </Card>
    </div>
  )
}

function WeekCard({
  week,
  done,
  onToggle,
  catLabel,
  t,
}: {
  week: StudyWeek
  done: boolean
  onToggle: () => void
  catLabel: (c: CivicsCategory) => string
  t: (key: UIKey, vars?: Record<string, string | number>) => string
}) {
  const topics = week.categories.map(catLabel).join(' · ')
  const heading =
    week.kind === 'learn'
      ? `${t('planKindLearn')}: ${topics}`
      : week.kind === 'simulacros'
        ? t('planKindSimulacros')
        : t('planKindReview')

  return (
    <Card className={cn('space-y-3', done && 'opacity-70')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {t('weekTitle', { n: week.week })}
          </p>
          <h2 className="text-xl font-bold leading-snug">{heading}</h2>
          {week.kind === 'learn' && (
            <p className="text-base text-slate-500">{t('questionsCount', { n: week.questionIds.length })}</p>
          )}
        </div>
        <span className="shrink-0 text-3xl">{done ? '✅' : week.kind === 'learn' ? '📖' : week.kind === 'simulacros' ? '📝' : '🎯'}</span>
      </div>

      {week.kind === 'review' && <p className="text-base text-slate-600 dark:text-slate-300">{t('reviewWeekTip')}</p>}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {week.kind === 'learn' ? (
          <Link href={`/estudiar?ids=${week.questionIds.join(',')}`}>
            <Button variant="primary" className="w-full">
              📚 {t('studyThisWeek')}
            </Button>
          </Link>
        ) : (
          <Link href="/examen">
            <Button variant="primary" className="w-full">
              📝 {t('doExam')}
            </Button>
          </Link>
        )}
        <Button variant={done ? 'success' : 'secondary'} onClick={onToggle}>
          {done ? t('weekDone') : t('markDone')}
        </Button>
      </div>
    </Card>
  )
}
