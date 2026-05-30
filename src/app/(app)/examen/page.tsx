'use client'

import { useEffect, useState } from 'react'
import type { ExamMode } from '@/features/civics/types'
import { EXAM_CONFIGS } from '@/features/civics/types'
import { ExamRunner } from '@/features/civics/components/exam-runner'
import { useSettings } from '@/shared/settings/settings-context'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'

export default function ExamenPage() {
  const { t } = useSettings()
  const [mode, setMode] = useState<ExamMode | null>(null)

  // Permite enlace directo desde Elegibilidad: /examen?modo=mode6520
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('modo')
    if (param && param in EXAM_CONFIGS) setMode(param as ExamMode)
  }, [])

  if (mode) {
    return <ExamRunner mode={mode} onExit={() => setMode(null)} />
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t('exam')}</h1>

      <Card className="space-y-3">
        <h2 className="text-xl font-bold">📝 {t('startExam')} — 2025</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">{t('examIntro2025')}</p>
        <Button big variant="primary" className="w-full" onClick={() => setMode('standard2025')}>
          {t('startExam')}
        </Button>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-xl font-bold">★ {t('startExam')} — 65/20</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">{t('examIntro6520')}</p>
        <Button big variant="secondary" className="w-full" onClick={() => setMode('mode6520')}>
          {t('startExam')}
        </Button>
      </Card>

      <p className="text-center text-sm text-slate-400">{t('passStopNote')}</p>
    </div>
  )
}
