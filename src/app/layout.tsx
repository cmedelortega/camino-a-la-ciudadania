import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Camino a la Ciudadanía | Examen de Civismo EE. UU.',
  description:
    'Prepárate para el examen de civismo de naturalización de EE. UU. (versión 2025, 128 preguntas) en español e inglés, con audio y práctica por voz.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
