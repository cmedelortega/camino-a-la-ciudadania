'use client'

import Link from 'next/link'
import { useSettings } from '@/shared/settings/settings-context'
import { useProgress } from '@/features/civics/hooks/use-progress'
import { CIVICS_QUESTIONS_2025 } from '@/features/civics/data/questions-2025'
import { Card } from '@/shared/components/card'

export default function Home() {
  const { t } = useSettings()
  const { counts, loaded } = useProgress()
  const total = CIVICS_QUESTIONS_2025.length

  const tiles: Array<{ href: string; icon: string; title: string; desc: string }> = [
    { href: '/elegibilidad', icon: '🧭', title: t('eligibility'), desc: t('eligibilityDesc') },
    { href: '/proceso', icon: '🧾', title: t('process'), desc: t('processDesc') },
    { href: '/plan', icon: '📆', title: t('studyPlan'), desc: t('studyPlanDesc') },
    { href: '/estudiar', icon: '📚', title: t('study'), desc: t('studyDesc') },
    { href: '/examen', icon: '📝', title: t('exam'), desc: t('examDesc') },
    { href: '/asistente', icon: '🤖', title: t('assistant'), desc: t('assistantDesc') },
  ]

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">🇺🇸 {t('appName')}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{t('tagline')}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="block">
            <Card className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-5xl">{tile.icon}</div>
              <h2 className="mt-3 text-2xl font-bold">{tile.title}</h2>
              <p className="mt-1 text-lg text-slate-600 dark:text-slate-300">{tile.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Resumen de progreso */}
      <Link href="/progreso" className="block">
        <Card className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{t('progress')}</h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              {loaded ? `${counts.mastered} / ${total} ${t('mastered').toLowerCase()}` : '…'}
            </p>
          </div>
          <span className="text-4xl">📊</span>
        </Card>
      </Link>

      <p className="text-center text-sm text-slate-400">{t('officialNote')}</p>
    </div>
  )
}
