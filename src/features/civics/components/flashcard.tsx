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

  const questionText = lang === 'es' ? question.questionEs : question.questionEn
  const officialEn = question.questionEn

  // Reinicia el estado al cambiar de pregunta.
  useEffect(() => {
    setRevealed(false)
    setVoiceResult(null)
    reco.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  // Evalúa la respuesta hablada cuando llega el transcript.
  useEffect(() => {
    if (!reco.transcript) return
    const resolved = resolveAnswer(question, lang, stateCode)
    const pool = resolved.answers.length ? resolved.answers : []
    setVoiceResult(matchesAnswer(reco.transcript, pool))
    setRevealed(true)
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
          {voiceResult !== null && (
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

      {/* Autocalificación */}
      {revealed && onRate && (
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
