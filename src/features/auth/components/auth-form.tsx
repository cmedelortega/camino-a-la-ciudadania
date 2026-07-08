'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { useAuth } from './auth-provider'
import { useSettings } from '@/shared/settings/settings-context'
import { Button } from '@/shared/components/button'
import { Card } from '@/shared/components/card'

export function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const { supabase, configured } = useAuth()
  const { t } = useSettings()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase || busy) return
    setBusy(true)
    setError(null)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.assign('/')
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.session) window.location.assign('/')
        else setCheckEmail(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }

  const inputClass = 'w-full rounded-xl glass-input p-4 text-lg'

  return (
    <Card className="w-full max-w-md space-y-5">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">🇺🇸 {t('appName')}</h1>
        <h2 className="mt-2 text-2xl font-bold">{mode === 'signin' ? t('signInTitle') : t('signUpTitle')}</h2>
        <p className="mt-1 text-base text-slate-600 dark:text-slate-300">{t('loginWelcome')}</p>
      </div>

      {!configured && (
        <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
          <p className="font-semibold text-amber-800 dark:text-amber-200">⚠️ {t('authNotConfiguredTitle')}</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">{t('authNotConfiguredBody')}</p>
        </div>
      )}

      {checkEmail ? (
        <p className="rounded-lg bg-green-50 p-4 text-lg font-medium text-green-800 dark:bg-green-950/40 dark:text-green-200">
          📧 {t('checkEmail')}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-base font-semibold">{t('emailLabel')}</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-base font-semibold">{t('passwordLabel')}</span>
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-base text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <Button big type="submit" className="w-full" disabled={!configured || busy}>
            {busy ? t('authProcessing') : mode === 'signin' ? t('signInBtn') : t('signUpBtn')}
          </Button>
        </form>
      )}

      <div className="text-center">
        <Link
          href={mode === 'signin' ? '/signup' : '/login'}
          className="text-base font-semibold text-blue-700 underline dark:text-blue-400"
        >
          {mode === 'signin' ? t('noAccount') : t('haveAccount')}
        </Link>
      </div>
    </Card>
  )
}
