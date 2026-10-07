import { type ReactNode } from 'react'

import { cn } from '@iap/ui'

interface ClaimRequestInfoListCardProps {
  title: string
  value: ReactNode
  className?: string
  classNameTitle?: string
  classNameValue?: string
  hasSeprator?: boolean
}

function ClaimRequestInfoListCard(props: ClaimRequestInfoListCardProps) {
  const {
    value,
    title,
    classNameValue,
    classNameTitle,
    className,
    hasSeprator = true,
  } = props

  return (
    <>
      <div className={cn('flex px-1', className)}>
        <p
          className={cn(
            'whitespace-nowrap pe-0.5 text-sm font-medium text-gray-400',
            classNameTitle
          )}
        >
          {title}:
        </p>
        {typeof value === 'string' ? (
          <p
            className={cn(
              'whitespace-pre-wrap text-sm font-semibold text-text-primary',
              classNameValue
            )}
          >
            {value}
          </p>
        ) : (
          value
        )}
      </div>
      {hasSeprator && <p className='text-gray-500'>,</p>}
    </>
  )
}

export default ClaimRequestInfoListCard
