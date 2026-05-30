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
        <div className="flex items-center justify-between gap-3">
          <Button big variant="secondary" onClick={s.decreaseFont} disabled={s.fontScale <= FONT_MIN}>
            A− {t('smaller')}
          </Button>
          <span className="text-2xl font-bold">{Math.round(s.fontScale * 100)}%</span>
          <Button big variant="secondary" onClick={s.increaseFont} disabled={s.fontScale >= FONT_MAX}>
            A+ {t('bigger')}
          </Button>
        </div>
      </Card>

      {/* Contraste y tema */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('highContrast')}</h2>
          <Button variant={s.highContrast ? 'success' : 'secondary'} onClick={s.toggleContrast}>
            {s.highContrast ? t('on') : t('off')}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('darkMode')}</h2>
          <Button variant={s.dark ? 'success' : 'secondary'} onClick={s.toggleDark}>
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
          className="w-full rounded-xl border-2 border-slate-300 bg-white p-4 text-lg dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="">— {t('selectState')} —</option>
          {US_STATES.map((st) => (
            <option key={st.code} value={st.code}>
              {s.lang === 'es' ? st.nameEs : st.nameEn}
            </option>
          ))}
        </select>
      </Card>

      <p className="text-center text-sm text-slate-400">{t('officialNote')}</p>
    </div>
  )
}
