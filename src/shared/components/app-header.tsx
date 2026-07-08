'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSettings } from '@/shared/settings/settings-context'
import { useAuth } from '@/features/auth/components/auth-provider'
import { AccessibilityBar } from './accessibility-bar'
import { cn } from '@/shared/lib/utils'

export function AppHeader() {
  const { t } = useSettings()
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const links: Array<{ href: string; label: string }> = [
    { href: '/', label: t('home') },
    { href: '/elegibilidad', label: t('eligibility') },
    { href: '/proceso', label: t('process') },
    { href: '/plan', label: t('studyPlan') },
    { href: '/estudiar', label: t('study') },
    { href: '/examen', label: t('exam') },
    { href: '/asistente', label: t('assistant') },
    { href: '/progreso', label: t('progress') },
    { href: '/ajustes', label: t('settings') },
  ]

  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
            🇺🇸 {t('appName')}
          </Link>
          <div className="flex items-center gap-2">
            <AccessibilityBar />
            {user && (
              <button
                onClick={() => signOut()}
                className="glass-pill rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                {t('signOut')}
              </button>
            )}
          </div>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label={t('home')}>
          {links.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-base font-semibold transition-all',
                  active
                    ? 'glass-sheen border border-blue-400/50 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'glass-pill text-slate-700 dark:text-slate-200',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
