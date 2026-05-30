import { cn } from '@/shared/lib/utils'

/** Superficie tipo tarjeta. La clase `card-surface` permite reforzar bordes en alto contraste. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'card-surface rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
        'dark:border-slate-700 dark:bg-slate-900',
        className,
      )}
      {...props}
    />
  )
}
