import { useMemo } from 'react'

import { isAdminRole, isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission } from '@iap/ui'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useClaimRequestStore } from '../context/store/claim-request-store'
import { ClaimRequestExportExcelButton } from './claim-request-export-excel-button'
import { ClaimRequestInquiryFanavaranButton } from './claim-request-inquiry-fanavaran-button'

export function ClaimRequestHeaderActions(props: {
  filters: ApiFilterParams
  isFetching: boolean
  onRefresh: () => Promise<unknown> | void
  selectedIds: string[]
}) {
  const { filters, isFetching, onRefresh, selectedIds } = props
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
      <Permission hasPermission={canSuperAdmin}>
        <Button
          className='space-x-2'
          disabled={!hasSelection}
          onClick={() => setOpenDialog('bulkDataExtraction')}
        >
          {t('claimRequests.bulkDataExtraction.button')}
        </Button>
        <Button
          className='space-x-2'
          disabled={!hasSelection}
          onClick={() => setOpenDialog('bulkStatusChange')}
          variant='destructive'
        >
          {t('claimRequests.bulkStatusChange.button')}
        </Button>
        <Button
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
          claimRequestIds={selectedIds}
          onSuccess={onRefresh}
        />
      </Permission>
      <ClaimRequestExportExcelButton filters={filters} />
      <Button
        className='space-x-2'
        disabled={isFetching}
        onClick={onRefresh}
        variant='outline'
      >
        <RefreshCw
          aria-hidden='true'
          className={isFetching ? 'animate-spin' : ''}
        />
        <span>{t('claimRequests.refresh')}</span>
      </Button>
    </div>
  )
}
