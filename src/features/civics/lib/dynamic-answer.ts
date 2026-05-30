import type { CivicsQuestion } from '../types'
import type { Lang } from '@/shared/i18n/dict'
import { CURRENT_OFFICIALS, OFFICIALS_AS_OF } from '../data/current-officials'
import { findState } from '../data/states'

export interface ResolvedAnswer {
  /** Respuestas a mostrar (ya resueltas según funcionario/estado, o las estáticas). */
  answers: string[]
  /** true si el valor cambia con el tiempo / depende del estado → mostrar advertencia. */
  isDynamic: boolean
  /** Para datos nacionales: fecha de vigencia del valor mostrado. */
  asOf?: string
  /** true si necesita que el usuario elija su estado o verifique manualmente. */
  needsVerification?: boolean
}

/**
 * Devuelve las respuestas a mostrar para una pregunta, resolviendo las dinámicas:
 * - nacionales (Presidente, VP, Speaker, Chief Justice): valor fechado de config.
 * - estatales (capital): se resuelve con el estado elegido; gobernador/senador/
 *   representante se marcan para verificación manual (datos volátiles).
 */
export function resolveAnswer(q: CivicsQuestion, lang: Lang, stateCode: string | null): ResolvedAnswer {
  if (!q.dynamic) {
    return { answers: lang === 'es' ? q.answersEs : q.answersEn, isDynamic: false }
  }

  const { scope, key } = q.dynamic

  if (scope === 'national') {
    const official = CURRENT_OFFICIALS[key as keyof typeof CURRENT_OFFICIALS]
    if (official) {
      return { answers: [official.name], isDynamic: true, asOf: OFFICIALS_AS_OF }
    }
    return { answers: [], isDynamic: true, needsVerification: true }
  }

  // scope === 'state'
  if (key === 'stateCapital') {
    const st = findState(stateCode)
    if (st && st.capital) return { answers: [st.capital], isDynamic: true }
    if (st && st.capital === null) {
      return { answers: lang === 'es' ? ['D.C. no es un estado y no tiene capital'] : ['D.C. is not a state and has no capital'], isDynamic: true }
    }
    return { answers: [], isDynamic: true, needsVerification: true }
  }

  // governor / senator / representative → volátiles, verificar manualmente
  return { answers: [], isDynamic: true, needsVerification: true }
}
