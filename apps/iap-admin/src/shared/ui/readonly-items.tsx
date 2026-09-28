import type { ReactNode } from 'react'

import { cn } from '@iap/ui'

type ReadonlyItemsProps = {
  className?: string
  classNameTitle?: string
  classNameValue?: string
  title: string
  value: ReactNode
}

export function ReadonlyItems(props: ReadonlyItemsProps) {
  const { className, classNameTitle, classNameValue, title, value } = props

  return (
    <div className={cn('border-r-2 border-border px-2', className)}>
      <p className={cn('text-sm font-medium text-gray-400', classNameTitle)}>
        {title}
      </p>
      <div
        className={cn(
          'flex min-h-9 items-center whitespace-pre-wrap break-all rounded-md px-1 text-sm font-semibold text-text-primary',
          classNameValue
        )}
      >
        {value}
      </div>
    </div>
  )
}
