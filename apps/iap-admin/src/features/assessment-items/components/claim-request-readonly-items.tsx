import { type ReactNode } from 'react'

import { cn } from '@iap/ui'

interface IClaimRequestReadonlyItems {
  title: string
  value: ReactNode
  className?: string
  classNameTitle?: string
  classNameValue?: string
}

function ClaimRequestReadonlyItems(props: IClaimRequestReadonlyItems) {
  const { value, title, classNameValue, classNameTitle, className } = props
  return (
    <div className={cn('flex border-r-2 border-border p-2', className)}>
      <p
        className={cn(
          'whitespace-nowrap text-sm font-medium text-gray-400',
          classNameTitle
        )}
      >
        {title}
      </p>
      {typeof value === 'string' ? (
        <p
          className={cn(
            'whitespace-pre-wrap px-1 text-sm font-semibold text-text-primary',
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

export default ClaimRequestReadonlyItems
