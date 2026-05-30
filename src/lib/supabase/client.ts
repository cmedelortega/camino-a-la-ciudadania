import { createBrowserClient } from '@supabase/ssr'

/** ¿Hay credenciales de Supabase VÁLIDAS configuradas? (para degradar la UI sin romperla). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Acepta solo una URL http(s) real (evita placeholders como "your_supabase_url").
  return Boolean(anon && url && /^https?:\/\//.test(url))
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
