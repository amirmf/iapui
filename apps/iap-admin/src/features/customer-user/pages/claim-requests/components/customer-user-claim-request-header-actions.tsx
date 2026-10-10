import { ClaimRequestExportExcelButton } from '@features/claim-requests'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button } from '@iap/ui'
import { IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export interface CustomerUserClaimRequestHeaderActionsProps {
  isLoading: boolean
  onRefetch: () => Promise<unknown> | void
  filters: ApiFilterParams
}

export function CustomerUserClaimRequestHeaderActions(
  props: CustomerUserClaimRequestHeaderActionsProps
) {
  const { isLoading, onRefetch, filters } = props
  const { t } = useTranslation()

  return (
    <div className='flex flex-wrap gap-2'>
      <ClaimRequestExportExcelButton filters={filters} />
      <Button
        variant='outline'
        presentation='reference'
        onClick={onRefetch}
        disabled={isLoading}
        className='space-x-2'
      >
        <IconRefresh size={18} className={isLoading ? 'animate-spin' : ''} />
        <span>{t('claimRequests.refresh')}</span>
      </Button>
    </div>
  )
}

export default CustomerUserClaimRequestHeaderActions
