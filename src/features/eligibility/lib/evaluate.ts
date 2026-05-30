import type { EligibilityInput, EligibilityResult, EnglishExemption } from '../types'
import type { ExamMode } from '@/features/civics/types'

/** La versión 2025 del examen aplica a N-400 presentados en esta fecha o después. */
export const CIVICS_2025_CUTOFF = '2025-10-20'
/** Días que USCIS permite presentar antes de cumplir el requisito de tiempo. */
export const EARLY_FILING_DAYS = 90

const MS_PER_DAY = 86_400_000

/** Parsea 'YYYY-MM-DD' como fecha local (mediodía, evita problemas de zona horaria). */
export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Años completos transcurridos entre dos fechas. */
export function fullYearsBetween(from: Date, to: Date): number {
  let years = to.getFullYear() - from.getFullYear()
  const monthDiff = to.getMonth() - from.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && to.getDate() < from.getDate())) years--
  return years
}

function addYears(d: Date, n: number): Date {
  return new Date(d.getFullYear() + n, d.getMonth(), d.getDate(), 12, 0, 0, 0)
}

function subtractDays(d: Date, days: number): Date {
  return new Date(d.getTime() - days * MS_PER_DAY)
}

/**
 * Evalúa la elegibilidad para naturalización a partir de los datos del usuario.
 * `today` se inyecta para que la función sea pura y verificable.
 */
export function evaluateEligibility(input: EligibilityInput, today: Date = new Date()): EligibilityResult {
  const birth = parseDate(input.birthDate)
  const lpr = parseDate(input.lprDate)
  const filing = parseDate(input.filingDate)

  // Regla de tiempo: 3 años si está casado/a con ciudadano y cumple convivencia; si no, 5.
  const useThreeYear = input.marriedToUSCitizen && input.spouse3yMet
  const basis = useThreeYear ? 'threeYear' : 'fiveYear'
  const yearsRequired = useThreeYear ? 3 : 5
  const physicalPresenceMonths = useThreeYear ? 18 : 30
  const continuousMonths = useThreeYear ? 36 : 60

  // Fecha más temprana para presentar = cumplir el requisito menos 90 días.
  const earliest = subtractDays(addYears(lpr, yearsRequired), EARLY_FILING_DAYS)
  const alreadyEligible = today.getTime() >= earliest.getTime()
  const canFileOnPlannedDate = filing.getTime() >= earliest.getTime()

  // Edad y años como LPR se miden a la fecha de presentación.
  const ageAtFiling = fullYearsBetween(birth, filing)
  const yearsAsLprAtFiling = fullYearsBetween(lpr, filing)

  // Exención de inglés (la de mayor beneficio aplicable).
  let englishExemption: EnglishExemption | null = null
  let simplifiedCivics = false
  if (ageAtFiling >= 65 && yearsAsLprAtFiling >= 20) {
    englishExemption = '65/20'
    simplifiedCivics = true
  } else if (ageAtFiling >= 55 && yearsAsLprAtFiling >= 15) {
    englishExemption = '55/15'
  } else if (ageAtFiling >= 50 && yearsAsLprAtFiling >= 20) {
    englishExemption = '50/20'
  }

  // Versión del examen según fecha de presentación.
  const civicsVersion = filing.getTime() >= parseDate(CIVICS_2025_CUTOFF).getTime() ? '2025' : '2008'

  // Modo recomendado para practicar.
  let recommendedMode: ExamMode
  if (simplifiedCivics) recommendedMode = 'mode6520'
  else if (civicsVersion === '2025') recommendedMode = 'standard2025'
  else recommendedMode = 'standard2008'

  return {
    basis,
    yearsRequired,
    ageAtFiling,
    yearsAsLprAtFiling,
    earliestFilingDate: toISODate(earliest),
    alreadyEligible,
    canFileOnPlannedDate,
    englishExemption,
    simplifiedCivics,
    civicsVersion,
    recommendedMode,
    physicalPresenceMonths,
    continuousMonths,
  }
}
