import { openrouter, MODELS, isAiConfigured } from '@/lib/ai/openrouter'
import { generateObject } from 'ai'
import { z } from 'zod'
import type { Lang } from '@/shared/i18n/dict'

export const runtime = 'nodejs'
export const maxDuration = 20

/** Veredicto de la IA sobre una respuesta hablada. */
const gradeSchema = z.object({
  correct: z.boolean().describe('true si la respuesta hablada sería aceptada por un oficial de USCIS'),
  feedback: z.string().describe('Una frase breve de retroalimentación en el idioma del usuario'),
})

interface GradeBody {
  questionEn: string
  questionEs?: string
  /** Respuestas oficiales aceptables (en inglés y/o español). */
  acceptableAnswers: string[]
  /** Lo que dijo el estudiante (transcripción del micrófono). */
  spoken: string
  lang?: Lang
}

function buildSystem(lang: Lang): string {
  if (lang === 'es') {
    return [
      'Eres un oficial de USCIS calificando la parte oral del examen de civismo (naturalización).',
      'Recibes: la pregunta, las respuestas oficiales aceptables y lo que dijo el estudiante (transcrito por micrófono).',
      'Decide si la respuesta hablada sería ACEPTADA, con el mismo criterio flexible de un oficial real:',
      '- Acepta equivalencias de significado, sinónimos y frases parciales que nombren un elemento válido.',
      '- Si la pregunta pide "uno" o "un ejemplo", basta con que mencione UNO correcto.',
      '- Acepta la respuesta en inglés o en español.',
      '- Ignora muletillas, artículos y errores menores de transcripción del micrófono.',
      '- Marca INCORRECTO solo si la respuesta es equivocada, no relacionada o está vacía.',
      'Devuelve "correct" (booleano) y "feedback": UNA frase breve en español (si acertó, felicítalo corto; si falló, di cuál era la respuesta correcta).',
    ].join('\n')
  }
  return [
    'You are a USCIS officer grading the oral part of the civics (naturalization) test.',
    'You receive: the question, the official acceptable answers, and what the student said (mic transcript).',
    'Decide whether the spoken answer would be ACCEPTED, using the same lenient judgment as a real officer:',
    '- Accept meaning-equivalents, synonyms, and partial phrasings that name a valid item.',
    '- If the question asks for "one" or "an example", naming ONE correct item is enough.',
    '- Accept the answer in English or Spanish.',
    '- Ignore filler words, articles, and minor mic transcription errors.',
    '- Mark INCORRECT only if the answer is wrong, unrelated, or empty.',
    'Return "correct" (boolean) and "feedback": ONE short sentence in English (praise briefly if right; if wrong, state the correct answer).',
  ].join('\n')
}

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return Response.json({ error: 'not_configured' }, { status: 503 })
  }

  let body: GradeBody
  try {
    body = (await req.json()) as GradeBody
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 })
  }

  const { questionEn, questionEs, acceptableAnswers, spoken, lang = 'es' } = body
  if (!questionEn || !Array.isArray(acceptableAnswers) || !spoken?.trim()) {
    return Response.json({ error: 'bad_request' }, { status: 400 })
  }

  const question = lang === 'es' && questionEs ? `${questionEs} (${questionEn})` : questionEn
  const prompt = [
    lang === 'es' ? `Pregunta: ${question}` : `Question: ${question}`,
    lang === 'es' ? 'Respuestas oficiales aceptables:' : 'Official acceptable answers:',
    ...acceptableAnswers.map((a) => `- ${a}`),
    '',
    lang === 'es' ? `El estudiante dijo: "${spoken}"` : `The student said: "${spoken}"`,
  ].join('\n')

  try {
    const { object } = await generateObject({
      model: openrouter(MODELS.fast),
      schema: gradeSchema,
      system: buildSystem(lang),
      prompt,
    })
    return Response.json(object)
  } catch (e) {
    console.error('[grade-answer]', e)
    return Response.json({ error: 'ai_error' }, { status: 502 })
  }
}
