import { openrouter, MODELS, isAiConfigured } from '@/lib/ai/openrouter'
import { generateText } from 'ai'
import type { Lang } from '@/shared/i18n/dict'

export const runtime = 'nodejs'
export const maxDuration = 30

/** Preguntas cívicas volátiles que dependen del estado/distrito del usuario. */
type VerifyKey = 'senator' | 'representative' | 'governor'

interface VerifyBody {
  key: VerifyKey
  stateName: string
  zip?: string | null
  lang?: Lang
}

const TARGET: Record<VerifyKey, { es: string; en: string }> = {
  senator: {
    es: 'los dos senadores federales (U.S. Senate)',
    en: 'the two U.S. senators',
  },
  representative: {
    es: 'el representante en la Cámara de Representantes (U.S. House)',
    en: 'the U.S. House representative',
  },
  governor: {
    es: 'el gobernador actual',
    en: 'the current governor',
  },
}

function buildSystem(lang: Lang): string {
  if (lang === 'es') {
    return [
      'Eres un verificador de datos cívicos para el examen de naturalización de EE. UU.',
      'Usa la búsqueda web y prioriza fuentes oficiales: senate.gov, house.gov, congress.gov y sitios .gov estatales.',
      'Responde SOLO con el dato vigente hoy, en español, en este formato exacto y sin texto adicional:',
      'Respuesta: <nombre(s), separados por coma si son varios>',
      'Cargo: <cargo y estado>',
      'Fuente: <una URL oficial>',
      'Vigente: <mes y año>',
      'Sé breve. Si necesitas el código postal para identificar al representante y no se dio, responde exactamente: "Respuesta: Falta el código postal" y explica en una línea que se agregue en Ajustes.',
    ].join('\n')
  }
  return [
    'You are a civics fact-checker for the U.S. naturalization test.',
    'Use web search and prioritize official sources: senate.gov, house.gov, congress.gov and state .gov sites.',
    'Answer ONLY with today’s current data, in English, in this exact format with no extra text:',
    'Answer: <name(s), comma-separated if several>',
    'Role: <role and state>',
    'Source: <one official URL>',
    'Current as of: <month and year>',
    'Be brief. If you need the ZIP code to identify the representative and none was given, reply exactly: "Answer: ZIP code missing" and explain in one line to add it in Settings.',
  ].join('\n')
}

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return Response.json({ error: 'not_configured' }, { status: 503 })
  }

  let body: VerifyBody
  try {
    body = (await req.json()) as VerifyBody
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 })
  }

  const { key, stateName, zip, lang = 'es' } = body
  if (!key || !TARGET[key] || !stateName) {
    return Response.json({ error: 'bad_request' }, { status: 400 })
  }

  const target = TARGET[key][lang]
  const locale = zip ? `${stateName} (ZIP ${zip})` : stateName
  const today = new Date().toISOString().slice(0, 10)
  const prompt =
    lang === 'es'
      ? `¿Quién es ${target} de ${locale} a día de hoy (${today})? Verifica el dato vigente.`
      : `Who is ${target} for ${locale} as of today (${today})? Verify the current data.`

  try {
    // El sufijo :online activa la búsqueda web de OpenRouter para datos vigentes.
    const { text } = await generateText({
      model: openrouter(`${MODELS.balanced}:online`),
      system: buildSystem(lang),
      prompt,
    })
    return Response.json({ text: text.trim() })
  } catch (e) {
    console.error('[verify-answer]', e)
    return Response.json({ error: 'ai_error' }, { status: 502 })
  }
}
