import { type ReactNode } from 'react'

import { Button } from '@iap/ui'
import { IconArrowRight } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

interface MyClaimRequestPageHeaderProps {
  title: string
  description?: string
  backLink?: string
  showBackButton?: boolean
  actions?: ReactNode
}

export function MyClaimRequestPageHeader(props: MyClaimRequestPageHeaderProps) {
  const {
    title,
    description,
    backLink = '/myclaims/',
    showBackButton = false,
    actions,
  } = props
  return (
    <div className='flex flex-wrap items-start justify-between gap-4'>
      <div className='flex items-center gap-4'>
        {showBackButton && (
          <Button
            presentation='reference'
            asChild
            variant='outline'
            size='icon'
          >
            <Link to={backLink}>
              <IconArrowRight size={20} />
            </Link>
          </Button>
        )}
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
          {description && (
            <p className='text-sm text-muted-foreground'>{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className='flex flex-wrap items-center gap-2'>{actions}</div>
      )}
    </div>
  )
}
