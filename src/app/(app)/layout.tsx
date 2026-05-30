'use client'

import { AppHeader } from '@/shared/components/app-header'
import { SyncGate } from '@/features/auth/components/sync-gate'

/** Layout de la app protegida: header + sincronización de progreso. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
        <SyncGate>{children}</SyncGate>
      </main>
    </>
  )
}
