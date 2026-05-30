'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Lang } from '@/shared/i18n/dict'
import { t as translate, type UIKey } from '@/shared/i18n/dict'

export interface Settings {
  lang: Lang
  /** Multiplicador del tamaño de fuente (1.0 – 1.6). */
  fontScale: number
  highContrast: boolean
  dark: boolean
  /** Código de estado (p. ej. "CA"). null si no se ha elegido. */
  stateCode: string | null
}

const DEFAULTS: Settings = {
  lang: 'es',
  fontScale: 1.15,
  highContrast: false,
  dark: false,
  stateCode: null,
}

const STORAGE_KEY = 'civics.settings.v1'
export const FONT_MIN = 1.0
export const FONT_MAX = 1.6
export const FONT_STEP = 0.15

interface SettingsContextValue extends Settings {
  setLang: (lang: Lang) => void
  increaseFont: () => void
  decreaseFont: () => void
  toggleContrast: () => void
  toggleDark: () => void
  setStateCode: (code: string | null) => void
  /** Traduce una clave de UI al idioma actual. */
  t: (key: UIKey, vars?: Record<string, string | number>) => string
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function applyToDocument(s: Settings) {
  const root = document.documentElement
  root.style.setProperty('--font-scale', String(s.fontScale))
  root.classList.toggle('dark', s.dark)
  root.classList.toggle('contrast', s.highContrast)
  root.lang = s.lang
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  // Carga desde localStorage al montar (solo en cliente).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch {
      /* ignora almacenamiento no disponible */
    }
    setLoaded(true)
  }, [])

  // Persiste y aplica al documento en cada cambio.
  useEffect(() => {
    if (!loaded) return
    applyToDocument(settings)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* ignora */
    }
  }, [settings, loaded])

  const setLang = useCallback((lang: Lang) => setSettings((s) => ({ ...s, lang })), [])
  const increaseFont = useCallback(
    () => setSettings((s) => ({ ...s, fontScale: Math.min(FONT_MAX, +(s.fontScale + FONT_STEP).toFixed(2)) })),
    [],
  )
  const decreaseFont = useCallback(
    () => setSettings((s) => ({ ...s, fontScale: Math.max(FONT_MIN, +(s.fontScale - FONT_STEP).toFixed(2)) })),
    [],
  )
  const toggleContrast = useCallback(() => setSettings((s) => ({ ...s, highContrast: !s.highContrast })), [])
  const toggleDark = useCallback(() => setSettings((s) => ({ ...s, dark: !s.dark })), [])
  const setStateCode = useCallback((stateCode: string | null) => setSettings((s) => ({ ...s, stateCode })), [])

  const t = useCallback(
    (key: UIKey, vars?: Record<string, string | number>) => translate(key, settings.lang, vars),
    [settings.lang],
  )

  return (
    <SettingsContext.Provider
      value={{ ...settings, setLang, increaseFont, decreaseFont, toggleContrast, toggleDark, setStateCode, t }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings debe usarse dentro de <SettingsProvider>')
  return ctx
}
