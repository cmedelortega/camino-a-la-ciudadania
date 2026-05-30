import type { CivicsCategory } from '@/features/civics/types'
import { CIVICS_QUESTIONS_2025, QUESTIONS_6520 } from '@/features/civics/data/questions-2025'

export type DeckId = 'all' | '6520'
export type WeekKind = 'learn' | 'simulacros' | 'review'

export interface StudyWeek {
  /** Número de semana (1-based). */
  week: number
  kind: WeekKind
  /** Categorías que se estudian esa semana (solo en semanas 'learn'). */
  categories: CivicsCategory[]
  /** Preguntas asignadas a la semana. */
  questionIds: number[]
}

export interface StudyPlan {
  deck: DeckId
  weeks: StudyWeek[]
  totalQuestions: number
}

export const MIN_WEEKS = 1
export const MAX_WEEKS = 12
const MS_PER_DAY = 86_400_000

/** Semanas (enteras, hacia arriba) desde hoy hasta la fecha objetivo, acotado a [1, 12]. */
export function weeksUntil(targetISO: string, today: Date = new Date()): number {
  const [y, m, d] = targetISO.split('-').map(Number)
  const target = new Date(y, m - 1, d, 12, 0, 0, 0)
  const days = Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY)
  const w = Math.ceil(days / 7)
  return Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, w))
}

/** Divide `n` elementos en `k` grupos contiguos lo más parejos posible. Devuelve tamaños. */
function splitSizes(n: number, k: number): number[] {
  const base = Math.floor(n / k)
  const rem = n % k
  return Array.from({ length: k }, (_, i) => base + (i < rem ? 1 : 0))
}

function distinctCategories(ids: number[], byId: Map<number, CivicsCategory>): CivicsCategory[] {
  const seen = new Set<CivicsCategory>()
  const order: CivicsCategory[] = []
  for (const id of ids) {
    const c = byId.get(id)
    if (c && !seen.has(c)) {
      seen.add(c)
      order.push(c)
    }
  }
  return order
}

/**
 * Genera un plan de estudio repartiendo las preguntas por semanas en orden
 * pedagógico (las preguntas ya vienen agrupadas por tema), y reservando las
 * últimas semanas para simulacros y repaso según el tiempo disponible.
 */
export function generatePlan(deck: DeckId, weeks: number): StudyPlan {
  const totalWeeks = Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, Math.round(weeks)))
  const pool = deck === '6520' ? QUESTIONS_6520 : CIVICS_QUESTIONS_2025
  const ids = pool.map((q) => q.id)
  const byId = new Map(pool.map((q) => [q.id, q.category]))

  // Reserva semanas finales: simulacros (si hay ≥5) y repaso (si hay ≥3).
  const reviewWeeks = totalWeeks >= 3 ? 1 : 0
  const simulacroWeeks = totalWeeks >= 5 ? 1 : 0
  const learnWeeks = Math.max(1, totalWeeks - reviewWeeks - simulacroWeeks)

  const result: StudyWeek[] = []
  let weekNo = 1

  // Semanas de aprendizaje: repartir las preguntas en bloques contiguos parejos.
  const sizes = splitSizes(ids.length, learnWeeks)
  let cursor = 0
  for (let i = 0; i < learnWeeks; i++) {
    const chunk = ids.slice(cursor, cursor + sizes[i])
    cursor += sizes[i]
    result.push({ week: weekNo++, kind: 'learn', categories: distinctCategories(chunk, byId), questionIds: chunk })
  }

  if (simulacroWeeks) {
    result.push({ week: weekNo++, kind: 'simulacros', categories: [], questionIds: [...ids] })
  }
  if (reviewWeeks) {
    result.push({ week: weekNo++, kind: 'review', categories: [], questionIds: [...ids] })
  }

  return { deck, weeks: result, totalQuestions: ids.length }
}
