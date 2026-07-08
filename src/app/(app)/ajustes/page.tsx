'use client'

import { useSettings, FONT_MAX, FONT_MIN } from '@/shared/settings/settings-context'
import { US_STATES } from '@/features/civics/data/states'
import { Card } from '@/shared/components/card'
import { Button } from '@/shared/components/button'

export default function AjustesPage() {
  const s = useSettings()
  const { t } = s

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('settings')}</h1>

      {/* Idioma */}
      <Card className="space-y-3">
        <h2 className="text-xl font-bold">{t('language')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button big variant={s.lang === 'es' ? 'primary' : 'secondary'} onClick={() => s.setLang('es')}>
            Español
          </Button>
          <Button big variant={s.lang === 'en' ? 'primary' : 'secondary'} onClick={() => s.setLang('en')}>
            English
          </Button>
        </div>
      </Card>

      {/* Tamaño de texto */}
      <Card className="space-y-3">
        <h2 className="text-xl font-bold">{t('textSize')}</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button className="min-w-0 flex-1" big variant="secondary" onClick={s.decreaseFont} disabled={s.fontScale <= FONT_MIN}>
            A− {t('smaller')}
          </Button>
          <span className="shrink-0 text-2xl font-bold">{Math.round(s.fontScale * 100)}%</span>
          <Button className="min-w-0 flex-1" big variant="secondary" onClick={s.increaseFont} disabled={s.fontScale >= FONT_MAX}>
            A+ {t('bigger')}
          </Button>
        </div>
      </Card>

      {/* Contraste y tema */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 text-xl font-bold">{t('highContrast')}</h2>
          <Button className="shrink-0" variant={s.highContrast ? 'success' : 'secondary'} onClick={s.toggleContrast}>
            {s.highContrast ? t('on') : t('off')}
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 text-xl font-bold">{t('darkMode')}</h2>
          <Button className="shrink-0" variant={s.dark ? 'success' : 'secondary'} onClick={s.toggleDark}>
            {s.dark ? t('on') : t('off')}
          </Button>
        </div>
      </Card>

      {/* Estado */}
      <Card className="space-y-3">
        <h2 className="text-xl font-bold">{t('myState')}</h2>
        <p className="text-base text-slate-600 dark:text-slate-300">{t('dependsOnState')}</p>
        <select
          value={s.stateCode ?? ''}
          onChange={(e) => s.setStateCode(e.target.value || null)}
          className="w-full rounded-xl glass-input p-4 text-lg"
        >
          <option value="">— {t('selectState')} —</option>
          {US_STATES.map((st) => (
            <option key={st.code} value={st.code}>
              {s.lang === 'es' ? st.nameEs : st.nameEn}
            </option>
          ))}
        </select>

        <div className="space-y-1 pt-2">
          <label htmlFor="zip" className="block text-lg font-semibold">
            {t('zipCode')}
          </label>
          <input
            id="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={s.zip ?? ''}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 5)
              s.setZip(digits || null)
            }}
            placeholder="90001"
            className="w-full rounded-xl glass-input p-4 text-lg"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('zipHelp')}</p>
        </div>
      </Card>

      <p className="text-center text-sm text-slate-400">{t('officialNote')}</p>
    </div>
  )
}
