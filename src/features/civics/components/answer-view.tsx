'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { CivicsQuestion } from '../types'
import { resolveAnswer } from '../lib/dynamic-answer'
import { USCIS_TEST_UPDATES_URL } from '../data/current-officials'
import { findState } from '../data/states'
import { useSettings } from '@/shared/settings/settings-context'
import { useSpeech } from '@/shared/hooks/use-speech'
import { Button } from '@/shared/components/button'

/** Muestra las respuestas aceptables de una pregunta, resolviendo las dinámicas y avisos. */
export function AnswerView({ question }: { question: CivicsQuestion }) {
  const { lang, stateCode, zip, t } = useSettings()
  const { speak, stop, speaking } = useSpeech()
  const resolved = resolveAnswer(question, lang, stateCode)
  const note = lang === 'es' ? question.noteEs : question.noteEn

  const answersText = resolved.answers.join('. ')

  // Verificación con IA para preguntas volátiles por estado (senador/representante/gobernador).
  const canSearch =
    resolved.needsVerification && question.dynamic?.scope === 'state' && question.dynamic.key !== 'stateCapital'
  const dynKey = question.dynamic?.key

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

      {/* Búsqueda y verificación con IA para respuestas volátiles por estado */}
      {canSearch && dynKey && (
        <AiVerify
          questionKey={dynKey as 'senator' | 'representative' | 'governor'}
          stateCode={stateCode}
          zip={zip}
          lang={lang}
        />
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

/** Bloque de búsqueda + resultado verificado por IA (con búsqueda web). */
function AiVerify({
  questionKey,
  stateCode,
  zip,
  lang,
}: {
  questionKey: 'senator' | 'representative' | 'governor'
  stateCode: string | null
  zip: string | null
  lang: 'es' | 'en'
}) {
  const { t } = useSettings()
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Averigua si el asistente de IA está configurado (sin exponer la clave).
  useEffect(() => {
    let alive = true
    fetch('/api/ai-status')
      .then((r) => r.json())
      .then((d) => alive && setConfigured(Boolean(d?.configured)))
      .catch(() => alive && setConfigured(false))
    return () => {
      alive = false
    }
  }, [])

  const st = findState(stateCode)
  const stateName = st ? (lang === 'es' ? st.nameEs : st.nameEn) : null

  async function search() {
    if (!stateName) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/verify-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: questionKey, stateName, zip, lang }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { text?: string }
      setResult(data.text?.trim() || t('aiVerifyError'))
    } catch {
      setError(t('aiVerifyError'))
    } finally {
      setLoading(false)
    }
  }

  // Sin clave de IA: no ofrecemos la búsqueda.
  if (configured === false) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">ℹ️ {t('aiNotConfigured')}</p>
  }

  // Falta elegir estado: guiar a Ajustes.
  if (!stateName) {
    return (
      <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/40">
        <p className="text-blue-800 dark:text-blue-300">{t('needStateFirst')}</p>
        <Link href="/ajustes" className="mt-1 inline-block font-semibold text-blue-700 underline dark:text-blue-400">
          {t('goToSettings')} →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Button variant="primary" onClick={search} disabled={loading || configured === null}>
        {loading ? `⏳ ${t('searchingAi')}` : `🔎 ${result ? t('searchAgainAi') : t('searchWithAi')}`}
      </Button>

      {questionKey === 'representative' && !zip && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          💡 {t('zipHelpsRepresentative')}{' '}
          <Link href="/ajustes" className="font-semibold text-blue-700 underline dark:text-blue-400">
            {t('goToSettings')}
          </Link>
        </p>
      )}

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      {result && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/40">
          <p className="whitespace-pre-line text-lg font-medium text-slate-800 dark:text-slate-100">{result}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">⚠️ {t('aiVerifyDisclaimer')}</p>
        </div>
      )}
    </div>
  )
}
