import type { ReactNode } from 'react'

import { cn } from '@iap/ui'

interface MyClaimRequestReadonlyItemsProps {
  title: string
  value: ReactNode
  className?: string
  classNameTitle?: string
  classNameValue?: string
}

function MyClaimRequestReadonlyItems(props: MyClaimRequestReadonlyItemsProps) {
  const { value, title, classNameValue, classNameTitle, className } = props
  return (
    <div className={cn('border-r-2 border-border px-2', className)}>
      <p className={cn('text-sm font-medium text-gray-400', classNameTitle)}>
        {title}
      </p>
      {typeof value === 'string' ? (
        <p
          className={cn(
            'flex min-h-9 items-center whitespace-pre-wrap rounded-md px-1 text-sm font-semibold text-text-primary',
            classNameValue
          )}
        >
          {value}
        </p>
      ) : (
        value
      )}
    </div>
  )
}

export default MyClaimRequestReadonlyItems
