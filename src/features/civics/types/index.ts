/**
 * Tipos del módulo de civismo (examen de naturalización USCIS).
 * Fuente oficial: M-1778 (09/25) — "128 Civics Questions and Answers (2025 version)".
 * El texto en inglés es el oficial de USCIS; el español es traducción de apoyo para estudio.
 */

export type CivicsCategory =
  | 'principles' // A: Principios del gobierno estadounidense
  | 'system' // B: Sistema de gobierno
  | 'rights' // C: Derechos y responsabilidades
  | 'colonial' // Historia A: Período colonial e independencia
  | '1800s' // Historia B: Los años 1800
  | 'recent' // Historia C: Historia reciente y otra información importante
  | 'symbols' // Símbolos
  | 'holidays' // Feriados

/** Las respuestas que cambian con elecciones (nacional) o según el estado del usuario. */
export type DynamicKey =
  | 'president'
  | 'vicePresident'
  | 'speaker'
  | 'chiefJustice'
  | 'senator'
  | 'representative'
  | 'governor'
  | 'stateCapital'

export interface DynamicAnswer {
  /** 'national' = cambia con elecciones/nombramientos; 'state' = depende del estado del usuario. */
  scope: 'national' | 'state'
  key: DynamicKey
}

export interface CivicsQuestion {
  /** Número oficial de USCIS (1–128). */
  id: number
  category: CivicsCategory
  /** true si está marcada con ★: parte del subconjunto de 20 preguntas para la excepción 65/20. */
  is6520: boolean
  questionEn: string
  questionEs: string
  /** Respuestas oficiales aceptables (inglés). Vacío si la respuesta es dinámica. */
  answersEn: string[]
  /** Traducción de apoyo de las respuestas (español). Vacío si la respuesta es dinámica. */
  answersEs: string[]
  /** Presente solo si la respuesta cambia con el tiempo o depende del estado. */
  dynamic?: DynamicAnswer
  /** Nota aclaratoria opcional (p. ej. residentes de D.C. o territorios). */
  noteEn?: string
  noteEs?: string
}

export type TestVersion = '2025' | '2008'

/** Modos de examen según la situación del solicitante. */
export type ExamMode =
  | 'standard2025' // 20 preguntas, aprobar con 12 (versión 2025)
  | 'mode6520' // 10 de las 20 preguntas ★, aprobar con 6 (excepción 65/20)
  | 'standard2008' // 10 preguntas, aprobar con 6 (versión 2008)

export interface ExamConfig {
  mode: ExamMode
  /** Número de preguntas que hace el oficial. */
  askCount: number
  /** Mínimo de respuestas correctas para aprobar. */
  passCount: number
}

export const EXAM_CONFIGS: Record<ExamMode, ExamConfig> = {
  standard2025: { mode: 'standard2025', askCount: 20, passCount: 12 },
  mode6520: { mode: 'mode6520', askCount: 10, passCount: 6 },
  standard2008: { mode: 'standard2008', askCount: 10, passCount: 6 },
}

/** Estado de dominio de una pregunta para repaso. */
export type MasteryStatus = 'new' | 'learning' | 'mastered'

export interface QuestionProgress {
  questionId: number
  status: MasteryStatus
  timesCorrect: number
  timesSeen: number
  /** epoch ms de la última vez vista (para repaso espaciado simple). */
  lastSeen: number
}

export interface ExamAttempt {
  id: string
  mode: ExamMode
  date: number
  questionIds: number[]
  correctCount: number
  passed: boolean
}
