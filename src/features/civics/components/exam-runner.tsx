'use client'

import { useMemo, useState } from 'react'
import type { ExamMode } from '../types'
import { EXAM_CONFIGS } from '../types'
import { CIVICS_QUESTIONS_2025, QUESTIONS_6520 } from '../data/questions-2025'
import { AnswerView } from './answer-view'
import { QuestionBadges } from './question-badges'
import { useSettings } from '@/shared/settings/settings-context'
import { useSpeech } from '@/shared/hooks/use-speech'
import { useProgress } from '../hooks/use-progress'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'
import { sampleN } from '@/shared/lib/utils'

interface ExamRunnerProps {
  mode: ExamMode
  onExit: () => void
}

/** Simula la entrevista: el oficial hace N preguntas y se detiene al alcanzar el mínimo. */
export function ExamRunner({ mode, onExit }: ExamRunnerProps) {
  const { lang, t } = useSettings()
  const { speak, stop, speaking } = useSpeech()
  const { recordSeen, addAttempt } = useProgress()
  const config = EXAM_CONFIGS[mode]

  const deck = useMemo(() => {
    const pool = mode === 'mode6520' ? QUESTIONS_6520 : CIVICS_QUESTIONS_2025
    return sampleN(pool, config.askCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [finished, setFinished] = useState(false)
  const [savedAttempt, setSavedAttempt] = useState(false)

  const q = deck[index]
  const questionText = q ? (lang === 'es' ? q.questionEs : q.questionEn) : ''

  const passed = correct >= config.passCount
  // No se puede aprobar si los errores ya impiden llegar al mínimo.
  const cannotPass = wrong > config.askCount - config.passCount

  function rate(isCorrect: boolean) {
    if (!q) return
    recordSeen(q.id, isCorrect)
    const nextCorrect = correct + (isCorrect ? 1 : 0)
    const nextWrong = wrong + (isCorrect ? 0 : 1)
    setCorrect(nextCorrect)
    setWrong(nextWrong)

    const reachedPass = nextCorrect >= config.passCount
    const reachedFail = nextWrong > config.askCount - config.passCount
    const isLast = index >= deck.length - 1

    if (reachedPass || reachedFail || isLast) {
      finish(nextCorrect)
    } else {
      setIndex((i) => i + 1)
      setRevealed(false)
    }
  }

  function finish(finalCorrect: number) {
    setFinished(true)
    if (!savedAttempt) {
      addAttempt({
        id: `${Date.now()}`,
        mode,
        date: Date.now(),
        questionIds: deck.slice(0, index + 1).map((d) => d.id),
        correctCount: finalCorrect,
        passed: finalCorrect >= config.passCount,
      })
      setSavedAttempt(true)
    }
  }

  if (finished) {
    return (
      <Card className="space-y-5 text-center">
        <div className="text-6xl">{passed ? '🎉' : '💪'}</div>
        <h2 className={passed ? 'text-3xl font-bold text-green-600' : 'text-3xl font-bold text-amber-600'}>
          {passed ? t('examPassed') : t('examFailed')}
        </h2>
        <p className="text-xl">{t('examScore', { correct, total: config.askCount })}</p>
        <p className="text-base text-slate-500 dark:text-slate-400">{t('passStopNote')}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button big variant="secondary" onClick={onExit}>
            {t('finishExam')}
          </Button>
          <Button big variant="primary" onClick={() => window.location.reload()}>
            {t('tryAgain')}
          </Button>
        </div>
      </Card>
    )
  }

  if (!q) return null

  return (
    <div className="space-y-4">
      {/* Marcador */}
      <div className="flex items-center justify-between text-lg font-semibold">
        <span>{t('questionOf', { n: index + 1, total: config.askCount })}</span>
        <span>
          <span className="text-green-600">✓ {correct}</span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-500">
            {config.passCount} {t('mastered').toLowerCase()}
          </span>
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${((index + 1) / config.askCount) * 100}%` }}
        />
      </div>

      <Card className="space-y-5">
        <QuestionBadges question={q} />
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold leading-snug">{questionText}</h2>
          <Button variant="secondary" onClick={() => (speaking ? stop() : speak(questionText, lang))} aria-label={t('listen')}>
            🔊
          </Button>
        </div>

        {revealed ? (
          <>
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <AnswerView question={q} />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <Button big variant="danger" onClick={() => rate(false)}>
                ✗ {t('iGotItWrong')}
              </Button>
              <Button big variant="success" onClick={() => rate(true)}>
                ✓ {t('iGotItRight')}
              </Button>
            </div>
          </>
        ) : (
          <Button big variant="primary" className="w-full" onClick={() => setRevealed(true)}>
            {t('showAnswer')}
          </Button>
        )}
      </Card>

      {cannotPass && (
        <p className="text-center text-sm text-slate-400">{/* feedback silencioso: seguirá hasta cerrar */}</p>
      )}

      <Button variant="ghost" onClick={onExit} className="w-full">
        {t('back')}
      </Button>
    </div>
  )
}
