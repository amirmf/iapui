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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...rest}
          aria-label={label}
          className={cn('size-8 p-0', className)}
          ref={ref}
          size='sm'
          variant={rest.variant ?? 'ghost'}
        >
          {icon}
          <span className='sr-only'>{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent presentation={presentation}>
        {presentation === 'reference' ? <p>{tooltipText}</p> : tooltipText}
      </TooltipContent>
    </Tooltip>
  )
}
