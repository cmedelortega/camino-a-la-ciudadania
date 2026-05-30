'use client'

import Link from 'next/link'
import type { CivicsQuestion } from '../types'
import { resolveAnswer } from '../lib/dynamic-answer'
import { USCIS_TEST_UPDATES_URL } from '../data/current-officials'
import { useSettings } from '@/shared/settings/settings-context'
import { useSpeech } from '@/shared/hooks/use-speech'
import { Button } from '@/shared/components/button'

/** Muestra las respuestas aceptables de una pregunta, resolviendo las dinámicas y avisos. */
export function AnswerView({ question }: { question: CivicsQuestion }) {
  const { lang, stateCode, t } = useSettings()
  const { speak, stop, speaking } = useSpeech()
  const resolved = resolveAnswer(question, lang, stateCode)
  const note = lang === 'es' ? question.noteEs : question.noteEn

  const answersText = resolved.answers.join('. ')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400">{t('answer')}</h3>
        {answersText && (
          <Button
            variant="secondary"
            onClick={() => (speaking ? stop() : speak(answersText, lang))}
            aria-label={t('listen')}
          >
            🔊 {speaking ? t('stop') : t('listen')}
          </Button>
        )}
      </div>

      {resolved.answers.length > 0 ? (
        <ul className="space-y-1">
          {resolved.answers.map((a, i) => (
            <li key={i} className="text-xl font-medium">
              • {a}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg italic text-slate-600 dark:text-slate-300">{t('dependsOnState')}</p>
      )}

      {/* Avisos para respuestas dinámicas */}
      {resolved.isDynamic && resolved.asOf && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            {t('asOfDate', { date: resolved.asOf })}
          </p>
          <p className="text-amber-700 dark:text-amber-400">{t('checkBeforeInterview')}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href={`/asistente?q=${encodeURIComponent(lang === 'es' ? question.questionEs : question.questionEn)}&web=1`}
              className="font-semibold text-blue-700 underline dark:text-blue-400"
            >
              🤖 {t('verifyOfficial')}
            </Link>
            <a
              href={USCIS_TEST_UPDATES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 underline dark:text-blue-400"
            >
              uscis.gov ↗
            </a>
          </div>
        </div>
      )}

      {note && <p className="text-sm text-slate-500 dark:text-slate-400">ℹ️ {note}</p>}
    </div>
  )
}
