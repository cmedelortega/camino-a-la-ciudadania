import type { ExamMode } from '@/features/civics/types'

/** Datos que captura el wizard de elegibilidad. */
export interface EligibilityInput {
  /** Fecha de nacimiento (YYYY-MM-DD). */
  birthDate: string
  /** Fecha en que obtuvo la residencia permanente / Green Card (YYYY-MM-DD). */
  lprDate: string
  /** ¿Casado/a con ciudadano estadounidense? */
  marriedToUSCitizen: boolean
  /**
   * Para la regla de 3 años: ¿han vivido juntos y el cónyuge ha sido ciudadano
   * durante los últimos 3 años? Solo relevante si marriedToUSCitizen es true.
   */
  spouse3yMet: boolean
  /** Fecha planeada (o real) de presentación del Formulario N-400 (YYYY-MM-DD). */
  filingDate: string
}

export type EligibilityBasis = 'fiveYear' | 'threeYear'
export type EnglishExemption = '50/20' | '55/15' | '65/20'
export type CivicsVersion = '2008' | '2025'

/** Diagnóstico calculado (sin texto: la UI lo traduce). */
export interface EligibilityResult {
  basis: EligibilityBasis
  /** Años de residencia requeridos (5 o 3). */
  yearsRequired: number
  /** Edad en la fecha de presentación. */
  ageAtFiling: number
  /** Años como residente permanente en la fecha de presentación. */
  yearsAsLprAtFiling: number
  /** Fecha más temprana para presentar (requisito − ventana de 90 días). */
  earliestFilingDate: string
  /** ¿Ya puede presentar hoy? */
  alreadyEligible: boolean
  /** ¿La fecha planeada cumple el requisito de tiempo? */
  canFileOnPlannedDate: boolean
  /** Exención de inglés aplicable (la de mayor beneficio) o null. */
  englishExemption: EnglishExemption | null
  /** true si aplica 65/20 (civismo simplificado: solo 20 preguntas). */
  simplifiedCivics: boolean
  /** Versión del examen de civismo según la fecha de presentación. */
  civicsVersion: CivicsVersion
  /** Modo de examen recomendado para practicar en la app. */
  recommendedMode: ExamMode
  /** Meses de presencia física requeridos (30 para 5 años, 18 para 3 años). */
  physicalPresenceMonths: number
  /** Periodo de residencia continua en meses (60 o 36). */
  continuousMonths: number
}
