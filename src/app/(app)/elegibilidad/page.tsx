'use client'

import { useState } from 'react'
import { Wizard } from '@/features/eligibility/components/wizard'
import { ResultView } from '@/features/eligibility/components/result-view'
import { useEligibility } from '@/features/eligibility/hooks/use-eligibility'
import { useSettings } from '@/shared/settings/settings-context'

export default function ElegibilidadPage() {
  const { t } = useSettings()
  const { input, save, loaded } = useEligibility()
  const [editing, setEditing] = useState(false)

  if (!loaded) return null

  const showResult = input && !editing

  return (
    <div className="space-y-4">
      {!showResult && (
        <header>
          <h1 className="text-2xl font-bold">{t('eligibility')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{t('eligibilityDesc')}</p>
        </header>
      )}

      {showResult ? (
        <ResultView input={input} onEdit={() => setEditing(true)} />
      ) : (
        <Wizard
          initial={input}
          onComplete={(value) => {
            save(value)
            setEditing(false)
          }}
        />
      )}
    </div>
  )
}
