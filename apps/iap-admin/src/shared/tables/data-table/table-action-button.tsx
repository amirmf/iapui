import type { ComponentPropsWithRef, ReactNode } from 'react'

import { Button, Tooltip, TooltipContent, TooltipTrigger, cn } from '@iap/ui'

export type TableActionButtonProps = Omit<
  ComponentPropsWithRef<typeof Button>,
  'children' | 'size'
> & {
  icon: ReactNode
  label: string
  tooltipText?: ReactNode
  presentation?: 'default' | 'reference'
}

export function TableActionButton(props: TableActionButtonProps) {
  const {
    className,
    icon,
    label,
    ref,
    tooltipText = label,
    presentation = 'default',
    ...rest
  } = props
  const isReference = presentation === 'reference'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          presentation={presentation}
          {...rest}
          aria-label={label}
          className={cn(
            'size-8 p-0',
            isReference &&
              (rest.variant === 'destructive'
                ? 'text-destructive hover:bg-red-100 hover:text-destructive'
                : 'hover:bg-gray-200'),
            className
          )}
          ref={ref}
          size='sm'
          variant={isReference ? 'ghost' : (rest.variant ?? 'ghost')}
        >
          {icon}
          <span className='sr-only'>{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  )
}
