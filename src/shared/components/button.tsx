'use client'

import { cn } from '@/shared/lib/utils'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary:
    'glass-sheen border border-blue-400/50 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-blue-700',
  secondary: 'glass-pill glass-sheen text-slate-900 dark:text-slate-100',
  success:
    'glass-sheen border border-green-400/50 bg-gradient-to-b from-green-500 to-green-600 text-white shadow-lg shadow-green-600/25 hover:from-green-500 hover:to-green-700',
  danger:
    'glass-sheen border border-red-400/50 bg-gradient-to-b from-red-500 to-red-600 text-white shadow-lg shadow-red-600/25 hover:from-red-500 hover:to-red-700',
  ghost:
    'border border-transparent bg-transparent text-slate-700 backdrop-blur-sm hover:bg-white/50 dark:text-slate-200 dark:hover:bg-white/10',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Botón grande para áreas táctiles cómodas (65+). */
  big?: boolean
}

/** Botón accesible: áreas amplias, foco visible, alto contraste. */
export function Button({ variant = 'primary', big = false, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]',
        'focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        big ? 'min-h-touch px-6 py-4 text-xl' : 'px-4 py-3 text-base',
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
