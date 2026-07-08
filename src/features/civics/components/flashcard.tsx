'use client'

import { useEffect, useState } from 'react'
import type { CivicsQuestion } from '../types'
import { resolveAnswer } from '../lib/dynamic-answer'
import { AnswerView } from './answer-view'
import { QuestionBadges } from './question-badges'
import { useSettings } from '@/shared/settings/settings-context'
import { useSpeech } from '@/shared/hooks/use-speech'
import { useSpeechRecognition, matchesAnswer } from '@/shared/hooks/use-speech-recognition'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'

interface FlashcardProps {
  question: CivicsQuestion
  /** Se llama cuando el usuario califica la tarjeta (la sabía o no). */
  onRate?: (correct: boolean) => void
}

/** Tarjeta de estudio: pregunta + audio + práctica por voz + respuesta. */
export function Flashcard({ question, onRate }: FlashcardProps) {
  const { lang, stateCode, t } = useSettings()
  const { speak, stop, speaking } = useSpeech()
  const reco = useSpeechRecognition()
  const [revealed, setRevealed] = useState(false)
  const [voiceResult, setVoiceResult] = useState<null | boolean>(null)
  const [grading, setGrading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const questionText = lang === 'es' ? question.questionEs : question.questionEn
  const officialEn = question.questionEn

  // Reinicia el estado al cambiar de pregunta.
  useEffect(() => {
    setRevealed(false)
    setVoiceResult(null)
    setGrading(false)
    setFeedback(null)
    reco.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  // Califica la respuesta hablada cuando llega el transcript.
  // Un modelo de IA juzga el significado (como un oficial); si falla, respaldo local.
  useEffect(() => {
    if (!reco.transcript) return
    const spoken = reco.transcript
    const resolved = resolveAnswer(question, lang, stateCode)
    // Para preguntas fijas usamos ambas versiones (inglés/español); para dinámicas, las resueltas.
    const acceptable = question.dynamic
      ? resolved.answers
      : [...question.answersEn, ...question.answersEs]
    setRevealed(true)

    // Sin respuesta fija que calificar (dinámica volátil): coincidencia local.
    if (acceptable.length === 0) {
      setVoiceResult(matchesAnswer(spoken, acceptable))
      setFeedback(null)
      return
    }

    let alive = true
    setGrading(true)
    setFeedback(null)
    ;(async () => {
      try {
        const res = await fetch('/api/grade-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionEn: question.questionEn,
            questionEs: question.questionEs,
            acceptableAnswers: acceptable,
            spoken,
            lang,
          }),
        })
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as { correct: boolean; feedback?: string }
        if (!alive) return
        setVoiceResult(Boolean(data.correct))
        setFeedback(data.feedback?.trim() || null)
      } catch {
        // Respaldo: coincidencia de texto local si la IA no está disponible.
        if (!alive) return
        setVoiceResult(matchesAnswer(spoken, acceptable))
        setFeedback(null)
      } finally {
        if (alive) setGrading(false)
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reco.transcript])

  return (
    <Card className="space-y-5">
      <QuestionBadges question={question} />

      {/* Pregunta */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold leading-snug">
            <span className="mr-2 text-slate-400">#{question.id}</span>
            {questionText}
          </h2>
          <Button
            variant="secondary"
            onClick={() => (speaking ? stop() : speak(questionText, lang))}
            aria-label={t('listen')}
          >
            🔊
          </Button>
        </div>
        {lang === 'es' && (
          <p className="text-base italic text-slate-500 dark:text-slate-400">{officialEn}</p>
        )}
      </div>

      {/* Práctica por voz */}
      {reco.supported ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={reco.listening ? 'danger' : 'secondary'}
            onClick={() => (reco.listening ? reco.stop() : reco.start(lang))}
          >
            🎤 {reco.listening ? t('listening') : t('speakAnswer')}
          </Button>
          {reco.transcript && (
            <span className="text-base text-slate-600 dark:text-slate-300">“{reco.transcript}”</span>
          )}
          {grading && (
            <span className="text-base text-slate-500 dark:text-slate-400">⏳ {t('gradingAi')}</span>
          )}
          {!grading && voiceResult !== null && (
            <span className={voiceResult ? 'font-bold text-green-600' : 'font-bold text-red-600'}>
              {voiceResult ? '✓' : '✗'}
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{t('voiceNotSupported')}</p>
      )}

      {/* Respuesta */}
      {revealed ? (
        <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
          <AnswerView question={question} />
        </div>
      ) : (
        <Button big variant="primary" className="w-full" onClick={() => setRevealed(true)}>
          {t('showAnswer')}
        </Button>
      )}

      {/* Calificación: la IA califica la respuesta hablada; solo se corrige si el micrófono falló. */}
      {revealed && onRate && !grading && voiceResult !== null && (
        <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <p className={voiceResult ? 'font-bold text-green-600' : 'font-bold text-red-600'}>
            {voiceResult ? `✓ ${t('voiceCorrect')}` : `✗ ${t('voiceIncorrect')}`}
          </p>
          {feedback && <p className="text-base text-slate-600 dark:text-slate-300">{feedback}</p>}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
            <Button big variant="primary" onClick={() => onRate(voiceResult)}>
              {t('continueNext')}
            </Button>
            <Button big variant="secondary" onClick={() => onRate(!voiceResult)}>
              {voiceResult ? t('fixWasIncorrect') : t('fixWasCorrect')}
            </Button>
          </div>
        </div>
      )}

      {/* Autocalificación manual: solo cuando NO se respondió hablando (ni se está calificando). */}
      {revealed && onRate && !grading && voiceResult === null && (
        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button big variant="secondary" onClick={() => onRate(false)}>
            🔁 {t('reviewAgain')}
          </Button>
          <Button big variant="success" onClick={() => onRate(true)}>
            ✓ {t('iKnewIt')}
          </Button>
        </div>
      )}
    </Card>
  )
}
