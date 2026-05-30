'use client'

import type { CivicsQuestion } from '../types'
import { useSettings } from '@/shared/settings/settings-context'

/** Insignias: marca preguntas del subconjunto 65/20 y respuestas que cambian. */
export function QuestionBadges({ question }: { question: CivicsQuestion }) {
  const { t } = useSettings()
  if (!question.is6520 && !question.dynamic) return null
  return (
    <div className="flex flex-wrap gap-2">
      {question.is6520 && (
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
          ★ {t('badge6520')}
        </span>
      )}
      {question.dynamic && (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
          🔄 {t('badgeDynamic')}
        </span>
      )}
    </div>
  )
}
