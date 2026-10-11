import { cn, formatDate } from '@iap/ui'

interface HeaderDateProps {
  className?: string
  showTime?: boolean
}

export function HeaderDate(props: HeaderDateProps) {
  const { className } = props
  return (
    <div
      className={cn(
        'hidden px-2 text-sm text-text-primary sm:inline-block',
        className
      )}
    >
      {formatDate(new Date())}
    </div>
  )
}

HeaderDate.displayName = 'HeaderDate'
