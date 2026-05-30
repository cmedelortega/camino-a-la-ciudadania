'use client'

import { useProgress } from '@/features/civics/hooks/use-progress'
import { CIVICS_QUESTIONS_2025 } from '@/features/civics/data/questions-2025'
import { EXAM_CONFIGS } from '@/features/civics/types'
import { useSettings } from '@/shared/settings/settings-context'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'

export default function ProgresoPage() {
  const { t, lang } = useSettings()
  const { counts, attempts, reset, loaded } = useProgress()
  const total = CIVICS_QUESTIONS_2025.length
  const notSeen = total - counts.seen

  const pct = (n: number) => `${Math.round((n / total) * 100)}%`

  const fmtDate = (ms: number) =>
    new Date(ms).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('progress')}</h1>

      {/* Barra de dominio */}
      <Card className="space-y-4">
        <div className="flex h-5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full bg-green-600" style={{ width: pct(counts.mastered) }} />
          <div className="h-full bg-amber-500" style={{ width: pct(counts.learning) }} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label={t('mastered')} value={counts.mastered} color="text-green-600" />
          <Stat label={t('learning')} value={counts.learning} color="text-amber-600" />
          <Stat label={t('notSeen')} value={loaded ? notSeen : total} color="text-slate-500" />
        </div>
      </Card>

      {/* Exámenes recientes */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t('lastAttempts')}</h2>
        {attempts.length === 0 ? (
          <p className="text-lg text-slate-500">{t('noAttempts')}</p>
        ) : (
          <div className="space-y-2">
            {attempts.map((a) => (
              <Card key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold">
                    {a.mode === 'mode6520' ? '★ 65/20' : '2025'} ·{' '}
                    {t('examScore', { correct: a.correctCount, total: EXAM_CONFIGS[a.mode].askCount })}
                  </p>
                  <p className="text-sm text-slate-500">{fmtDate(a.date)}</p>
                </div>
                <span className={a.passed ? 'text-2xl' : 'text-2xl opacity-60'}>{a.passed ? '🎉' : '💪'}</span>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Button variant="danger" onClick={() => reset()}>
        {t('resetProgress')}
      </Button>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  )
}
