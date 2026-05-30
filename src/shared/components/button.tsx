'use client'

import { cn } from '@/shared/lib/utils'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600',
  secondary: 'bg-white text-slate-900 hover:bg-slate-100 border-2 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600',
  success: 'bg-green-600 text-white hover:bg-green-700 border-2 border-green-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-2 border-red-600',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-200 border-2 border-transparent dark:text-slate-200 dark:hover:bg-slate-800',
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
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors',
        'focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        big ? 'min-h-touch px-6 py-4 text-xl' : 'px-4 py-3 text-base',
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
