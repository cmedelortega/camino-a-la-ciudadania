'use client'

import { useSettings } from '@/shared/settings/settings-context'
import { cn } from '@/shared/lib/utils'

/** Controles de accesibilidad siempre visibles: idioma, tamaño de texto, contraste, tema. */
export function AccessibilityBar() {
  const { lang, setLang, increaseFont, decreaseFont, highContrast, toggleContrast, dark, toggleDark, t } =
    useSettings()

  const pill = 'rounded-lg px-3 py-2 text-sm font-semibold border-2 transition-colors'
  const active = 'bg-blue-600 text-white border-blue-600'
  const idle = 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600'

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('settings')}>
      {/* Idioma */}
      <div className="flex overflow-hidden rounded-lg border-2 border-slate-300 dark:border-slate-600">
        <button
          onClick={() => setLang('es')}
          className={cn('px-3 py-2 text-sm font-bold', lang === 'es' ? active : idle, 'border-0')}
          aria-pressed={lang === 'es'}
        >
          ES
        </button>
        <button
          onClick={() => setLang('en')}
          className={cn('px-3 py-2 text-sm font-bold', lang === 'en' ? active : idle, 'border-0')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
      </div>

      {/* Tamaño de texto */}
      <div className="flex items-center gap-1">
        <button onClick={decreaseFont} className={cn(pill, idle)} aria-label={t('smaller')}>
          A−
        </button>
        <button onClick={increaseFont} className={cn(pill, idle)} aria-label={t('bigger')}>
          A+
        </button>
      </div>

      {/* Alto contraste */}
      <button onClick={toggleContrast} className={cn(pill, highContrast ? active : idle)} aria-pressed={highContrast}>
        {t('highContrast')}
      </button>

      {/* Modo oscuro */}
      <button onClick={toggleDark} className={cn(pill, dark ? active : idle)} aria-pressed={dark}>
        {dark ? '☀︎' : '☾'} {t('darkMode')}
      </button>
    </div>
  )
}
