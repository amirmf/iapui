import type { ReactNode } from 'react'

import { Button } from '@iap/ui'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

export interface MyClaimRequestPageHeaderProps {
  actions?: ReactNode
  backLink?: string
  description?: string
  showBackButton?: boolean
  title: string
}

export function MyClaimRequestPageHeader({
  actions,
  backLink = '/myclaims',
  description,
  showBackButton = false,
  title,
}: MyClaimRequestPageHeaderProps) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-4'>
      <div className='flex items-center gap-4'>
        {showBackButton ? (
          <Button asChild size='icon' variant='outline'>
            <Link to={backLink}>
              <ArrowRightIcon className='size-5' />
            </Link>
          </Button>
        ) : null}
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
          {description ? (
            <p className='text-sm text-muted-foreground'>{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className='flex flex-wrap items-center gap-2'>{actions}</div>
      ) : null}
    </div>
  )
}
