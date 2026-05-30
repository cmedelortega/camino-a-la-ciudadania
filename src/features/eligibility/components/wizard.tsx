'use client'

import { useMemo, useState } from 'react'
import type { EligibilityInput } from '../types'
import { useSettings } from '@/shared/settings/settings-context'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'

type StepId = 'birth' | 'lpr' | 'married' | 'spouse3y' | 'filing'

interface WizardProps {
  initial?: EligibilityInput | null
  onComplete: (input: EligibilityInput) => void
}

/** Wizard de elegibilidad: una pregunta por pantalla, con botones e inputs grandes. */
export function Wizard({ initial, onComplete }: WizardProps) {
  const { t } = useSettings()
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? '')
  const [lprDate, setLprDate] = useState(initial?.lprDate ?? '')
  const [married, setMarried] = useState<boolean | null>(initial?.marriedToUSCitizen ?? null)
  const [spouse3y, setSpouse3y] = useState<boolean | null>(initial?.spouse3yMet ?? null)
  const [filingDate, setFilingDate] = useState(initial?.filingDate ?? '')
  const [step, setStep] = useState(0)

  // Los pasos: se omite "spouse3y" si no está casado/a con ciudadano.
  const steps = useMemo<StepId[]>(() => {
    const base: StepId[] = ['birth', 'lpr', 'married']
    if (married) base.push('spouse3y')
    base.push('filing')
    return base
  }, [married])

  const current = steps[Math.min(step, steps.length - 1)]
  const isLast = step >= steps.length - 1

  const canContinue =
    (current === 'birth' && !!birthDate) ||
    (current === 'lpr' && !!lprDate) ||
    (current === 'married' && married !== null) ||
    (current === 'spouse3y' && spouse3y !== null) ||
    (current === 'filing' && !!filingDate)

  function finish() {
    onComplete({
      birthDate,
      lprDate,
      marriedToUSCitizen: married ?? false,
      spouse3yMet: married ? spouse3y ?? false : false,
      filingDate,
    })
  }

  const today = new Date().toISOString().slice(0, 10)
  const dateInputClass =
    'w-full rounded-xl border-2 border-slate-300 bg-white p-4 text-xl dark:border-slate-600 dark:bg-slate-800'

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-slate-500">
        {t('stepOf', { n: step + 1, total: steps.length })}
      </p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>

      <Card className="space-y-5">
        {current === 'birth' && (
          <Field label={t('wizBirth')}>
            <input type="date" max={today} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={dateInputClass} />
          </Field>
        )}
        {current === 'lpr' && (
          <Field label={t('wizLpr')}>
            <input type="date" max={today} value={lprDate} onChange={(e) => setLprDate(e.target.value)} className={dateInputClass} />
          </Field>
        )}
        {current === 'married' && (
          <Field label={t('wizMarried')}>
            <YesNo value={married} onChange={(v) => { setMarried(v); if (!v) setSpouse3y(null) }} yes={t('yes')} no={t('no')} />
          </Field>
        )}
        {current === 'spouse3y' && (
          <Field label={t('wizSpouse3y')}>
            <YesNo value={spouse3y} onChange={setSpouse3y} yes={t('yes')} no={t('no')} />
          </Field>
        )}
        {current === 'filing' && (
          <Field label={t('wizFiling')}>
            <input type="date" value={filingDate} onChange={(e) => setFilingDate(e.target.value)} className={dateInputClass} />
          </Field>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button big variant="secondary" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          ← {t('previous')}
        </Button>
        {isLast ? (
          <Button big variant="success" disabled={!canContinue} onClick={finish}>
            {t('seeResult')}
          </Button>
        ) : (
          <Button big variant="primary" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
            {t('continue')} →
          </Button>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold leading-snug">{label}</h2>
      {children}
    </div>
  )
}

function YesNo({ value, onChange, yes, no }: { value: boolean | null; onChange: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button big variant={value === true ? 'primary' : 'secondary'} onClick={() => onChange(true)} aria-pressed={value === true}>
        {yes}
      </Button>
      <Button big variant={value === false ? 'primary' : 'secondary'} onClick={() => onChange(false)} aria-pressed={value === false}>
        {no}
      </Button>
    </div>
  )
}
