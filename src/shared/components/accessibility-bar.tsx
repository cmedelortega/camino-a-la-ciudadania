'use client'

import { useSettings } from '@/shared/settings/settings-context'
import { cn } from '@/shared/lib/utils'

/** Controles de accesibilidad siempre visibles: idioma, tamaño de texto, contraste, tema. */
export function AccessibilityBar() {
  const { lang, setLang, increaseFont, decreaseFont, highContrast, toggleContrast, dark, toggleDark, t } =
    useSettings()

  const pill = 'rounded-lg px-3 py-2 text-sm font-semibold transition-all'
  const active = 'glass-sheen border border-blue-400/50 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-600/25'
  const idle = 'glass-pill text-slate-700 dark:text-slate-200'

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('settings')}>
      {/* Idioma */}
      <div className="glass-pill flex overflow-hidden rounded-lg">
        <button
          onClick={() => setLang('es')}
          className={cn(
            'px-3 py-2 text-sm font-bold transition-colors',
            lang === 'es' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-white/40 dark:text-slate-200 dark:hover:bg-white/10',
          )}
          aria-pressed={lang === 'es'}
        >
          ES
        </button>
        <button
          onClick={() => setLang('en')}
          className={cn(
            'px-3 py-2 text-sm font-bold transition-colors',
            lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-white/40 dark:text-slate-200 dark:hover:bg-white/10',
          )}
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
