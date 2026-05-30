'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { EligibilityInput } from '../types'
import { evaluateEligibility, parseDate } from '../lib/evaluate'
import { useSettings } from '@/shared/settings/settings-context'
import { Card } from '@/shared/components/card'
import { Button } from '@/shared/components/button'

const MODE_KEY = {
  standard2025: 'mode_standard2025',
  mode6520: 'mode_mode6520',
  standard2008: 'mode_standard2008',
} as const

export function ResultView({ input, onEdit }: { input: EligibilityInput; onEdit: () => void }) {
  const { t, lang } = useSettings()
  const result = useMemo(() => evaluateEligibility(input), [input])

  const fmt = (iso: string) =>
    parseDate(iso).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('resultTitle')}</h1>

      {/* Resumen */}
      <Card className="space-y-2">
        <p className="text-lg font-semibold">{t(result.basis === 'threeYear' ? 'basisThree' : 'basisFive')}</p>
        <p className="text-lg">
          {t('ageYearsSummary', { age: result.ageAtFiling, lpr: result.yearsAsLprAtFiling })}
        </p>
      </Card>

      {/* Cuándo puede aplicar */}
      <Section title={t('whenCanApply')}>
        <p className={`text-xl font-bold ${result.alreadyEligible ? 'text-green-600' : 'text-amber-600'}`}>
          {t(result.alreadyEligible ? 'eligibleYes' : 'eligibleNo')}
        </p>
        <p className="text-lg">{t('earliestDate', { date: fmt(result.earliestFilingDate) })}</p>
        <p className="text-base text-slate-500 dark:text-slate-400">
          {t('earlyFilingNote', { years: result.yearsRequired })}
        </p>
        <p className={`text-base font-semibold ${result.canFileOnPlannedDate ? 'text-green-700' : 'text-red-600'}`}>
          {result.canFileOnPlannedDate
            ? t('plannedOk', { date: fmt(input.filingDate) })
            : t('plannedEarly', { date: fmt(input.filingDate), earliest: fmt(result.earliestFilingDate) })}
        </p>
      </Section>

      {/* Inglés */}
      <Section title={t('englishTitle')}>
        {result.englishExemption ? (
          <>
            <p className="text-xl font-bold text-green-600">
              {t('englishExemptYes', { rule: result.englishExemption })}
            </p>
            <p className="text-lg">{t('nativeLanguageNote')}</p>
            {result.simplifiedCivics && (
              <p className="rounded-lg bg-purple-50 p-3 text-base font-medium text-purple-800 dark:bg-purple-950/40 dark:text-purple-200">
                ★ {t('simplifiedNote')}
              </p>
            )}
          </>
        ) : (
          <p className="text-lg font-semibold">{t('englishExemptNo')}</p>
        )}
      </Section>

      {/* Civismo */}
      <Section title={t('civicsTitle')}>
        <p className="text-lg">{t(result.civicsVersion === '2025' ? 'version2025Info' : 'version2008Info')}</p>
        {result.civicsVersion === '2008' && (
          <p className="text-base text-amber-700 dark:text-amber-400">⚠️ {t('version2008AppNote')}</p>
        )}
        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/40">
          <p className="text-base font-semibold">{t('recommendStudy')}</p>
          <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300">{t(MODE_KEY[result.recommendedMode])}</p>
          <Link href={`/examen?modo=${result.recommendedMode}`}>
            <Button big variant="primary" className="mt-3 w-full">
              {t('goPractice')} →
            </Button>
          </Link>
        </div>
      </Section>

      {/* Recordatorios */}
      <Section title={t('remindersTitle')}>
        <ul className="space-y-2 text-lg">
          <li>• {t('reminderContinuous', { months: result.continuousMonths })}</li>
          <li>• {t('reminderPhysical', { months: result.physicalPresenceMonths })}</li>
          <li>• {t('reminderMoral')}</li>
        </ul>
      </Section>

      <p className="text-sm text-slate-400">{t('legalDisclaimer')}</p>

      <Button variant="secondary" className="w-full" onClick={onEdit}>
        ✎ {t('editAnswers')}
      </Button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </Card>
  )
}
