/**
 * Estados de EE. UU. + D.C. con su capital (dato estático y seguro).
 * Usado para resolver la pregunta #62 ("¿Cuál es la capital de su estado?").
 *
 * Las preguntas #23 (senadores), #29 (representante) y #61 (gobernador) también
 * dependen del estado pero son VOLÁTILES: la app indica al usuario verificarlas
 * en la fuente oficial; no se incluyen aquí para no mostrar datos desactualizados.
 */
export interface USState {
  /** Código postal de 2 letras. */
  code: string
  nameEn: string
  nameEs: string
  /** Capital del estado. null para D.C. (no es estado, no tiene capital). */
  capital: string | null
}

export const US_STATES: USState[] = [
  { code: 'AL', nameEn: 'Alabama', nameEs: 'Alabama', capital: 'Montgomery' },
  { code: 'AK', nameEn: 'Alaska', nameEs: 'Alaska', capital: 'Juneau' },
  { code: 'AZ', nameEn: 'Arizona', nameEs: 'Arizona', capital: 'Phoenix' },
  { code: 'AR', nameEn: 'Arkansas', nameEs: 'Arkansas', capital: 'Little Rock' },
  { code: 'CA', nameEn: 'California', nameEs: 'California', capital: 'Sacramento' },
  { code: 'CO', nameEn: 'Colorado', nameEs: 'Colorado', capital: 'Denver' },
  { code: 'CT', nameEn: 'Connecticut', nameEs: 'Connecticut', capital: 'Hartford' },
  { code: 'DE', nameEn: 'Delaware', nameEs: 'Delaware', capital: 'Dover' },
  { code: 'FL', nameEn: 'Florida', nameEs: 'Florida', capital: 'Tallahassee' },
  { code: 'GA', nameEn: 'Georgia', nameEs: 'Georgia', capital: 'Atlanta' },
  { code: 'HI', nameEn: 'Hawaii', nameEs: 'Hawái', capital: 'Honolulu' },
  { code: 'ID', nameEn: 'Idaho', nameEs: 'Idaho', capital: 'Boise' },
  { code: 'IL', nameEn: 'Illinois', nameEs: 'Illinois', capital: 'Springfield' },
  { code: 'IN', nameEn: 'Indiana', nameEs: 'Indiana', capital: 'Indianapolis' },
  { code: 'IA', nameEn: 'Iowa', nameEs: 'Iowa', capital: 'Des Moines' },
  { code: 'KS', nameEn: 'Kansas', nameEs: 'Kansas', capital: 'Topeka' },
  { code: 'KY', nameEn: 'Kentucky', nameEs: 'Kentucky', capital: 'Frankfort' },
  { code: 'LA', nameEn: 'Louisiana', nameEs: 'Luisiana', capital: 'Baton Rouge' },
  { code: 'ME', nameEn: 'Maine', nameEs: 'Maine', capital: 'Augusta' },
  { code: 'MD', nameEn: 'Maryland', nameEs: 'Maryland', capital: 'Annapolis' },
  { code: 'MA', nameEn: 'Massachusetts', nameEs: 'Massachusetts', capital: 'Boston' },
  { code: 'MI', nameEn: 'Michigan', nameEs: 'Míchigan', capital: 'Lansing' },
  { code: 'MN', nameEn: 'Minnesota', nameEs: 'Minnesota', capital: 'Saint Paul' },
  { code: 'MS', nameEn: 'Mississippi', nameEs: 'Misisipi', capital: 'Jackson' },
  { code: 'MO', nameEn: 'Missouri', nameEs: 'Misuri', capital: 'Jefferson City' },
  { code: 'MT', nameEn: 'Montana', nameEs: 'Montana', capital: 'Helena' },
  { code: 'NE', nameEn: 'Nebraska', nameEs: 'Nebraska', capital: 'Lincoln' },
  { code: 'NV', nameEn: 'Nevada', nameEs: 'Nevada', capital: 'Carson City' },
  { code: 'NH', nameEn: 'New Hampshire', nameEs: 'New Hampshire', capital: 'Concord' },
  { code: 'NJ', nameEn: 'New Jersey', nameEs: 'Nueva Jersey', capital: 'Trenton' },
  { code: 'NM', nameEn: 'New Mexico', nameEs: 'Nuevo México', capital: 'Santa Fe' },
  { code: 'NY', nameEn: 'New York', nameEs: 'Nueva York', capital: 'Albany' },
  { code: 'NC', nameEn: 'North Carolina', nameEs: 'Carolina del Norte', capital: 'Raleigh' },
  { code: 'ND', nameEn: 'North Dakota', nameEs: 'Dakota del Norte', capital: 'Bismarck' },
  { code: 'OH', nameEn: 'Ohio', nameEs: 'Ohio', capital: 'Columbus' },
  { code: 'OK', nameEn: 'Oklahoma', nameEs: 'Oklahoma', capital: 'Oklahoma City' },
  { code: 'OR', nameEn: 'Oregon', nameEs: 'Oregón', capital: 'Salem' },
  { code: 'PA', nameEn: 'Pennsylvania', nameEs: 'Pensilvania', capital: 'Harrisburg' },
  { code: 'RI', nameEn: 'Rhode Island', nameEs: 'Rhode Island', capital: 'Providence' },
  { code: 'SC', nameEn: 'South Carolina', nameEs: 'Carolina del Sur', capital: 'Columbia' },
  { code: 'SD', nameEn: 'South Dakota', nameEs: 'Dakota del Sur', capital: 'Pierre' },
  { code: 'TN', nameEn: 'Tennessee', nameEs: 'Tennessee', capital: 'Nashville' },
  { code: 'TX', nameEn: 'Texas', nameEs: 'Texas', capital: 'Austin' },
  { code: 'UT', nameEn: 'Utah', nameEs: 'Utah', capital: 'Salt Lake City' },
  { code: 'VT', nameEn: 'Vermont', nameEs: 'Vermont', capital: 'Montpelier' },
  { code: 'VA', nameEn: 'Virginia', nameEs: 'Virginia', capital: 'Richmond' },
  { code: 'WA', nameEn: 'Washington', nameEs: 'Washington', capital: 'Olympia' },
  { code: 'WV', nameEn: 'West Virginia', nameEs: 'Virginia Occidental', capital: 'Charleston' },
  { code: 'WI', nameEn: 'Wisconsin', nameEs: 'Wisconsin', capital: 'Madison' },
  { code: 'WY', nameEn: 'Wyoming', nameEs: 'Wyoming', capital: 'Cheyenne' },
  { code: 'DC', nameEn: 'Washington, D.C.', nameEs: 'Washington, D.C.', capital: null },
]

export function findState(code: string | null | undefined): USState | undefined {
  if (!code) return undefined
  return US_STATES.find((s) => s.code === code)
}
