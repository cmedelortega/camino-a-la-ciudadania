import { isAiConfigured } from '@/lib/ai/openrouter'

/** Indica a la UI si el asistente está configurado (sin exponer la clave). */
export async function GET() {
  return Response.json({ configured: isAiConfigured() })
}
