import type { SupabaseClient } from '@supabase/supabase-js'

/** Claves de localStorage que se sincronizan con la nube. */
export const SYNCED_KEYS = [
  'civics.settings.v1',
  'civics.progress.v1',
  'civics.attempts.v1',
  'civics.eligibility.v1',
  'civics.studyplan.v1',
  'civics.process.v1',
] as const

export type SyncedData = Record<string, unknown>

/** Lee el estado actual desde localStorage como un solo objeto. */
export function readLocalState(): SyncedData {
  const data: SyncedData = {}
  for (const key of SYNCED_KEYS) {
    const raw = localStorage.getItem(key)
    if (raw != null) {
      try {
        data[key] = JSON.parse(raw)
      } catch {
        /* ignora valores corruptos */
      }
    }
  }
  return data
}

/** Escribe en localStorage el estado traído de la nube. */
export function writeLocalState(data: SyncedData) {
  for (const key of SYNCED_KEYS) {
    if (key in data && data[key] != null) {
      localStorage.setItem(key, JSON.stringify(data[key]))
    }
  }
}

/** Trae el documento del usuario. Devuelve null si aún no tiene fila. */
export async function pullUserState(supabase: SupabaseClient, userId: string): Promise<SyncedData | null> {
  const { data, error } = await supabase.from('user_state').select('data').eq('user_id', userId).maybeSingle()
  if (error || !data) return null
  return (data.data as SyncedData) ?? null
}

/** Guarda (upsert) el documento del usuario en la nube. */
export async function pushUserState(supabase: SupabaseClient, userId: string, data: SyncedData): Promise<void> {
  await supabase.from('user_state').upsert(
    { user_id: userId, data, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
}

/** Hash estable simple para detectar cambios en el estado (evita subidas redundantes). */
export function snapshotHash(data: SyncedData): string {
  return JSON.stringify(data)
}
