'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from './auth-provider'
import { useSettings } from '@/shared/settings/settings-context'
import {
  pullUserState,
  pushUserState,
  readLocalState,
  writeLocalState,
  snapshotHash,
} from '../lib/cloud-sync'

/**
 * Sincroniza el progreso local ↔ Supabase:
 * - Al iniciar sesión, TRAE el documento del usuario y lo escribe en localStorage
 *   ANTES de renderizar la app (así los hooks leen los datos correctos al montar).
 * - Mientras se usa, SUBE los cambios cada cierto tiempo y al ocultar/cerrar la pestaña.
 */
export function SyncGate({ children }: { children: React.ReactNode }) {
  const { user, supabase, loading } = useAuth()
  const { t } = useSettings()
  const [hydrated, setHydrated] = useState(false)
  const lastHash = useRef('')

  useEffect(() => {
    if (loading) return
    if (!user || !supabase) {
      setHydrated(true)
      return
    }
    let cancelled = false
    ;(async () => {
      const remote = await pullUserState(supabase, user.id)
      if (cancelled) return
      if (remote) {
        writeLocalState(remote)
        lastHash.current = snapshotHash(remote)
      } else {
        const local = readLocalState()
        lastHash.current = snapshotHash(local)
        await pushUserState(supabase, user.id, local)
      }
      setHydrated(true)
    })()
    return () => {
      cancelled = true
    }
  }, [user, supabase, loading])

  useEffect(() => {
    if (!user || !supabase || !hydrated) return
    const push = () => {
      const local = readLocalState()
      const h = snapshotHash(local)
      if (h !== lastHash.current) {
        lastHash.current = h
        void pushUserState(supabase, user.id, local)
      }
    }
    const interval = setInterval(push, 8000)
    const onHide = () => push()
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', onHide)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', onHide)
      push()
    }
  }, [user, supabase, hydrated])

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-xl font-semibold text-slate-500">{t('loadingProgress')}</p>
      </div>
    )
  }
  return <>{children}</>
}
