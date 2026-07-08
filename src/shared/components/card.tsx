import { cn } from '@/shared/lib/utils'

/** Superficie tipo tarjeta. La clase `card-surface` permite reforzar bordes en alto contraste. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'card-surface glass-surface glass-sheen rounded-2xl p-6',
        className,
      )}
      {...props}
    />
  )
}
