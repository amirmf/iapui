import { Button, cn } from '@iap/ui'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function MyClaimRequestPageActions(props: {
  isLoading: boolean
  isFetching: boolean
  refetch: () => void
}) {
  const { isLoading, isFetching, refetch } = props
  const { t } = useTranslation()
  return (
    <>
      <Button
        presentation='reference'
        variant='outline'
        onClick={() => refetch()}
        disabled={isLoading || isFetching}
        className='gap-2'
      >
        <IconRefresh
          aria-hidden='true'
          size={18}
          className={cn(isFetching && 'animate-spin')}
        />
        <span>{t('myiap.claimRequests.refresh')}</span>
      </Button>
      <Button presentation='reference' asChild className='gap-2'>
        <Link to='/myclaims/create/'>
          <IconPlus aria-hidden='true' size={18} />
          <span>{t('myiap.claimRequests.create')}</span>
        </Link>
      </Button>
    </>
  )
}
