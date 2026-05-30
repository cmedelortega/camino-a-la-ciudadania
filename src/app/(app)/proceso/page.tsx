'use client'

import Link from 'next/link'
import type { UIKey } from '@/shared/i18n/dict'
import { PROCESS_STEPS, DOCUMENTS_CHECKLIST, type ProcessStep } from '@/features/process/data/steps'
import { useChecklist } from '@/features/process/hooks/use-checklist'
import { useSettings } from '@/shared/settings/settings-context'
import { useSpeech } from '@/shared/hooks/use-speech'
import { Card } from '@/shared/components/card'
import { Button } from '@/shared/components/button'

export default function ProcesoPage() {
  const { t, lang } = useSettings()
  const { checked, toggle, loaded } = useChecklist()
  const doneCount = DOCUMENTS_CHECKLIST.filter((d) => checked[d.id]).length

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">🧾 {t('process')}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">{t('processDesc')}</p>
      </header>

      <p className="text-base text-slate-600 dark:text-slate-300">{t('processIntro')}</p>

      {/* Línea de tiempo */}
      <Card className="bg-blue-50 dark:bg-blue-950/40">
        <h2 className="text-xl font-bold">{t('timelineTitle')}</h2>
        <p className="mt-1 text-lg">{t('timelineBody')}</p>
      </Card>

      {/* Pasos */}
      <div className="space-y-3">
        {PROCESS_STEPS.map((step) => (
          <StepCard key={step.id} step={step} lang={lang} t={t} />
        ))}
      </div>

      {/* Lista de documentos */}
      <section id="checklist" className="scroll-mt-24 space-y-3">
        <div>
          <h2 className="text-2xl font-bold">{t('checklistTitle')}</h2>
          <p className="text-base text-slate-600 dark:text-slate-300">{t('checklistDesc')}</p>
          {loaded && (
            <p className="mt-1 text-base font-semibold text-blue-600 dark:text-blue-400">
              {t('checklistProgress', { done: doneCount, total: DOCUMENTS_CHECKLIST.length })}
            </p>
          )}
        </div>
        <Card className="space-y-1">
          {DOCUMENTS_CHECKLIST.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggle(item.id)}
                className="h-7 w-7 shrink-0"
              />
              <span className={`text-lg ${checked[item.id] ? 'text-slate-400 line-through' : ''}`}>
                {lang === 'es' ? item.labelEs : item.labelEn}
              </span>
            </label>
          ))}
        </Card>
      </section>

      <p className="text-center text-sm text-slate-400">{t('legalDisclaimer')}</p>
    </div>
  )
}

function StepCard({
  step,
  lang,
  t,
}: {
  step: ProcessStep
  lang: 'es' | 'en'
  t: (k: UIKey, v?: Record<string, string | number>) => string
}) {
  const { speak, stop, speaking } = useSpeech()
  const title = lang === 'es' ? step.titleEs : step.titleEn
  const desc = lang === 'es' ? step.descEs : step.descEn
  const bullets = lang === 'es' ? step.bulletsEs : step.bulletsEn
  const time = lang === 'es' ? step.timeEs : step.timeEn
  const audio = `${title}. ${desc}. ${bullets.join('. ')}`

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{step.icon}</span>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {t('stepLabel', { n: step.id })}
            </p>
            <h2 className="text-xl font-bold leading-snug">{title}</h2>
          </div>
        </div>
        <Button variant="secondary" onClick={() => (speaking ? stop() : speak(audio, lang))} aria-label={t('listen')}>
          🔊
        </Button>
      </div>

      <p className="text-lg">{desc}</p>
      <ul className="space-y-1 text-lg">
        {bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
      {time && <p className="text-base italic text-slate-500 dark:text-slate-400">{time}</p>}

      {step.link &&
        (step.link.href.startsWith('#') ? (
          <a href={step.link.href}>
            <Button variant="primary" className="w-full">
              {lang === 'es' ? step.link.labelEs : step.link.labelEn} →
            </Button>
          </a>
        ) : (
          <Link href={step.link.href}>
            <Button variant="primary" className="w-full">
              {lang === 'es' ? step.link.labelEs : step.link.labelEn} →
            </Button>
          </Link>
        ))}
    </Card>
  )
}
