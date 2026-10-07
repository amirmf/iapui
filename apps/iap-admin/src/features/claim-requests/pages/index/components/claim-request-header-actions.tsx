import { useMemo } from 'react'

import { ClaimRequestDocumentReceiptButton } from '@features/claim-requests/pages/index/components/claim-request-document-receipt-button'
import { ClaimRequestExportExcelButton } from '@features/claim-requests/pages/index/components/claim-request-export-excel-button'
import { ClaimRequestInquiryFanavaranButton } from '@features/claim-requests/pages/index/components/claim-request-inquiry-fanavaran-button'
import { useClaimRequestStore } from '@features/claim-requests/pages/index/context/store/claim-request-store'
import { isAdminRole, isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission, cn } from '@iap/ui'
import { IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function ClaimRequestHeaderActions(props: {
  filters: ApiFilterParams
  isLoading: boolean
  onRefetch: () => Promise<unknown> | void
  claimRequestIds: string[]
}) {
  const { filters, isLoading, onRefetch, claimRequestIds } = props
  const { t } = useTranslation()
  const rowSelection = useClaimRequestStore((state) => state.rowSelection)
  const { user } = useAuthSession()
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const canAdmin = isAdminRole(user?.roles ?? [])
  const canSuperAdmin = isSuperAdminRole(user?.roles ?? [])
  const canGenerateAndSend =
    canAdmin ||
    Boolean(user?.roles?.includes('ROLE_HQ_USER')) ||
    Boolean(user?.roles?.includes('ROLE_BRANCH_USER'))
  const hasSelection = useMemo(
    () => Boolean(Object.keys(rowSelection).length),
    [rowSelection]
  )

  return (
    <div className='flex flex-wrap gap-2'>
      <ClaimRequestDocumentReceiptButton />
      <Permission hasPermission={canSuperAdmin}>
        <Button
          presentation='reference'
          type='button'
          className='space-x-2'
          disabled={!hasSelection}
          onClick={() => setOpenDialog('bulkDataExtraction')}
        >
          <span>{t('claimRequests.bulkDataExtraction.button')}</span>
        </Button>
        <Button
          presentation='reference'
          type='button'
          className='space-x-2'
          disabled={!hasSelection}
          onClick={() => setOpenDialog('bulkStatusChange')}
          variant='destructive'
        >
          <span>{t('claimRequests.bulkStatusChange.button')}</span>
        </Button>
        <Button
          presentation='reference'
          type='button'
          className='space-x-2'
          disabled={!hasSelection}
          onClick={() => setOpenDialog('bulkDelete')}
          variant='destructive'
        >
          <span>{t('claimRequests.bulkDelete.button')}</span>
        </Button>
      </Permission>
      <Permission hasPermission={canGenerateAndSend}>
        <Button
          presentation='reference'
          type='button'
          className='space-x-2'
          disabled={!hasSelection}
          onClick={() => setOpenDialog('bulkGenerateAndSend')}
          variant='secondary'
        >
          <span>{t('claimRequests.generateAndSendBulk.button')}</span>
        </Button>
      </Permission>
      <Permission hasPermission={canAdmin}>
        <ClaimRequestInquiryFanavaranButton
          claimRequestIds={claimRequestIds}
          onSuccess={onRefetch}
        />
      </Permission>
      <ClaimRequestExportExcelButton filters={filters} />
      <Button
        presentation='reference'
        type='button'
        className='space-x-2'
        disabled={isLoading}
        onClick={onRefetch}
        variant='outline'
      >
        <IconRefresh
          size={18}
          aria-hidden='true'
          className={cn(isLoading && 'animate-spin')}
        />
        <span>{t('claimRequests.refresh')}</span>
      </Button>
    </div>
  )
}
