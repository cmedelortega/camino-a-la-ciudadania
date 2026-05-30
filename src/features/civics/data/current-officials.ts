import type { DynamicKey } from '../types'

/**
 * Respuestas DINÁMICAS de alcance NACIONAL (cambian con elecciones o nombramientos).
 *
 * ⚠️ IMPORTANTE: Estos valores son una referencia con fecha. El solicitante DEBE
 * confirmar el nombre del funcionario vigente al momento de su entrevista en la
 * fuente oficial: uscis.gov/citizenship/testupdates
 *
 * La app muestra el valor con su fecha y permite "verificar el dato más reciente"
 * (verificación con IA + búsqueda web, cuando esté configurada).
 */

export interface OfficialEntry {
  key: Extract<DynamicKey, 'president' | 'vicePresident' | 'speaker' | 'chiefJustice'>
  /** Nombre del funcionario vigente a la fecha `asOf`. */
  name: string
  /** Fecha de verificación de este dato (ISO YYYY-MM-DD). */
  asOf: string
}

/** Fecha en que se revisaron por última vez estos datos. */
export const OFFICIALS_AS_OF = '2026-05-29'

/** Fuente oficial para confirmar cambios antes de la entrevista. */
export const USCIS_TEST_UPDATES_URL = 'https://www.uscis.gov/citizenship/testupdates'

export const CURRENT_OFFICIALS: Record<OfficialEntry['key'], OfficialEntry> = {
  president: { key: 'president', name: 'Donald J. Trump', asOf: OFFICIALS_AS_OF },
  vicePresident: { key: 'vicePresident', name: 'JD Vance', asOf: OFFICIALS_AS_OF },
  speaker: { key: 'speaker', name: 'Mike Johnson', asOf: OFFICIALS_AS_OF },
  chiefJustice: { key: 'chiefJustice', name: 'John Roberts (John G. Roberts, Jr.)', asOf: OFFICIALS_AS_OF },
}
