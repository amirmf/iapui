import type { ComponentPropsWithRef, ReactNode } from 'react'

import { Button, Tooltip, TooltipContent, TooltipTrigger, cn } from '@iap/ui'
import type { DataTablePresentation } from '@shared/tables/data-table/types'

export type TableActionVariant =
  | 'default'
  | 'destructive'
  | 'success'
  | 'primary'
  | 'info'
  | 'ghost'
  | 'outline'
  | 'secondary'

export type TableActionButtonProps = Omit<
  ComponentPropsWithRef<typeof Button>,
  'children' | 'size' | 'variant'
> & {
  icon: ReactNode
  label: string
  tooltipText?: ReactNode
  presentation?: DataTablePresentation
  variant?: TableActionVariant
}

export function TableActionButton(props: TableActionButtonProps) {
  const {
    className,
    icon,
    label,
    ref,
    tooltipText = label,
    presentation = 'default',
    variant = 'default',
    ...rest
  } = props
  const isReference = presentation === 'reference'

  const referenceVariantClass = cn('hover:bg-gray-200', {
    'text-destructive hover:bg-red-100 hover:text-destructive':
      variant === 'destructive',
    'text-blue-700 hover:bg-blue-100 hover:text-blue-700': variant === 'info',
    'text-green-700 hover:bg-green-100 hover:text-green-700':
      variant === 'success',
    'text-primary-700 hover:bg-primary-100 hover:text-primary-700':
      variant === 'primary',
  })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          presentation={presentation}
          {...rest}
          aria-label={label}
          className={cn(
            'size-8 p-0',
            isReference
              ? referenceVariantClass
              : variant === 'destructive'
                ? 'text-destructive'
                : undefined,
            className
          )}
          ref={ref}
          size='sm'
          variant={
            isReference
              ? 'ghost'
              : variant === 'info' ||
                  variant === 'primary' ||
                  variant === 'success'
                ? 'ghost'
                : variant
          }
        >
          {icon}
          <span className='sr-only'>{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent presentation={presentation}>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}
