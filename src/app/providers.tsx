'use client'

import { SettingsProvider } from '@/shared/settings/settings-context'
import { AuthProvider } from '@/features/auth/components/auth-provider'

/** Proveedores globales (disponibles tanto en /login como en la app protegida). */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AuthProvider>{children}</AuthProvider>
    </SettingsProvider>
  )
}
