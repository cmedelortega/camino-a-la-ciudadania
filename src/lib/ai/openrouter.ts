import { createOpenRouter } from '@openrouter/ai-sdk-provider'

/** Provider de OpenRouter (300+ modelos vía Vercel AI SDK). */
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
})

/** Modelos usados por el asistente. Editables según presupuesto/calidad. */
export const MODELS = {
  fast: 'google/gemini-2.5-flash',
  balanced: 'anthropic/claude-sonnet-4.5',
  powerful: 'anthropic/claude-sonnet-4.6',
} as const

export type ModelKey = keyof typeof MODELS

/** ¿Hay clave de OpenRouter configurada? (para degradar la UI con elegancia). */
export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY)
}
