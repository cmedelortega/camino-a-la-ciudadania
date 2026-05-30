import { openrouter, MODELS, isAiConfigured } from '@/lib/ai/openrouter'
import { buildSystemPrompt } from '@/features/assistant/lib/system-prompt'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import type { Lang } from '@/shared/i18n/dict'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    webSearch = false,
    lang = 'es',
  }: { messages: UIMessage[]; webSearch?: boolean; lang?: Lang } = await req.json()

  // Degradado: si no hay clave configurada, devolver un mensaje claro (la UI lo muestra).
  if (!isAiConfigured()) {
    const msg =
      lang === 'es'
        ? 'El asistente no está configurado todavía: falta la clave OPENROUTER_API_KEY en .env.local. Mientras tanto, usa Estudiar y Examen, que funcionan sin conexión.'
        : 'The assistant is not configured yet: OPENROUTER_API_KEY is missing in .env.local. In the meantime, use Study and Test, which work offline.'
    return new Response(msg, { status: 503 })
  }

  const modelMessages = await convertToModelMessages(messages)
  // El suffix :online activa la búsqueda web de OpenRouter para verificar datos vigentes.
  const modelId = webSearch ? `${MODELS.balanced}:online` : MODELS.balanced

  const result = streamText({
    model: openrouter(modelId),
    system: buildSystemPrompt(lang),
    messages: modelMessages,
  })

  return result.toUIMessageStreamResponse()
}
