'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { useSettings } from '@/shared/settings/settings-context'
import { useSpeech } from '@/shared/hooks/use-speech'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'

function messageText(m: UIMessage): string {
  if (!m.parts) return ''
  return m.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

export function ChatAssistant() {
  const { t, lang } = useSettings()
  const { speak, stop, speaking } = useSpeech()
  const { messages, sendMessage, status, error, setMessages } = useChat()
  const [input, setInput] = useState('')
  const [webSearch, setWebSearch] = useState(false)
  const [configured, setConfigured] = useState<boolean | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const isLoading = status === 'submitted' || status === 'streaming'

  // ¿Está configurado el asistente?
  useEffect(() => {
    fetch('/api/ai-status')
      .then((r) => r.json())
      .then((d) => setConfigured(Boolean(d.configured)))
      .catch(() => setConfigured(false))
  }, [])

  // Prefill desde enlace de "verificar en vivo": /asistente?q=...&web=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) setInput(q)
    if (params.get('web') === '1') setWebSearch(true)
  }, [])

  // Auto-scroll al último mensaje.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function submit(text: string) {
    const value = text.trim()
    if (!value || isLoading) return
    setInput('')
    sendMessage({ text: value }, { body: { webSearch, lang } })
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit(input)
  }

  const suggestions = [t('sug1'), t('sug2'), t('sug3'), t('sug4')]

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">🤖 {t('assistant')}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">{t('assistantDesc')}</p>
      </header>

      {configured === false && (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40">
          <h2 className="text-lg font-bold text-amber-800 dark:text-amber-200">
            ⚠️ {t('assistantNotConfiguredTitle')}
          </h2>
          <p className="mt-1 text-base text-amber-700 dark:text-amber-300">{t('assistantNotConfiguredBody')}</p>
        </Card>
      )}

      {/* Conversación */}
      <div className="min-h-[40vh] space-y-3">
        {messages.length === 0 ? (
          <Card>
            <p className="text-lg">{t('assistantIntro')}</p>
            <p className="mt-4 text-sm font-semibold text-slate-500">{t('suggestionsTitle')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-full border-2 border-blue-300 bg-blue-50 px-4 py-2 text-base font-medium text-blue-800 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        ) : (
          messages.map((m) => {
            const text = messageText(m)
            const isUser = m.role === 'user'
            return (
              <div key={m.id} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    isUser
                      ? 'max-w-[85%] rounded-2xl bg-blue-600 px-4 py-3 text-lg text-white'
                      : 'card-surface max-w-[90%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg dark:border-slate-700 dark:bg-slate-900'
                  }
                >
                  <p className="whitespace-pre-wrap">{text}</p>
                  {!isUser && text && (
                    <Button
                      variant="ghost"
                      className="mt-2 !px-2 !py-1 text-sm"
                      onClick={() => (speaking ? stop() : speak(text, lang))}
                    >
                      🔊 {speaking ? t('stop') : t('listen')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}

        {isLoading && <p className="animate-pulse text-lg italic text-slate-400">{t('thinking')}</p>}
        {error && (
          <Card className="border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error.message}
          </Card>
        )}
        <div ref={endRef} />
      </div>

      {/* Entrada */}
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="flex items-center gap-3 text-base font-medium">
          <input
            type="checkbox"
            checked={webSearch}
            onChange={(e) => setWebSearch(e.target.checked)}
            className="h-6 w-6"
          />
          🌐 {t('searchWeb')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('askPlaceholder')}
            disabled={isLoading}
            className="flex-1 rounded-xl border-2 border-slate-300 bg-white p-4 text-lg dark:border-slate-600 dark:bg-slate-800"
          />
          <Button big type="submit" disabled={isLoading || !input.trim()}>
            {t('send')}
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between">
        {messages.length > 0 ? (
          <Button variant="ghost" onClick={() => setMessages([])}>
            🗑 {t('clearChat')}
          </Button>
        ) : (
          <span />
        )}
      </div>

      <p className="text-center text-sm text-slate-400">{t('assistantDisclaimer')}</p>
    </div>
  )
}
