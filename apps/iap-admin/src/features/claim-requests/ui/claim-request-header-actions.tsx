import { isAdminRole, isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button } from '@iap/ui'
import { Download, RefreshCw, Send, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useClaimRequestStore } from '../model/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

export function ClaimRequestHeaderActions(props: {
  filters: ApiFilterParams
  isFetching: boolean
  onRefresh: () => void
  selectedIds: string[]
}) {
  const { filters, isFetching, onRefresh, selectedIds } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const canAdmin = isAdminRole(user?.roles ?? [])
  const canSuperAdmin = isSuperAdminRole(user?.roles ?? [])
  const hasSelection = selectedIds.length > 0

  const download = async () => {
    const blob = await claimRequestService.exportPageLiteExcel(filters)
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'claim-requests.xlsx'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {canSuperAdmin ? (
        <>
          <Button
            disabled={!hasSelection}
            onClick={() => setOpenDialog('bulkDataExtraction')}
          >
            {t('claimRequests.bulkDataExtraction.button')}
          </Button>
          <Button
            disabled={!hasSelection}
            onClick={() => setOpenDialog('bulkStatusChange')}
            variant='destructive'
          >
            {t('claimRequests.bulkStatusChange.button')}
          </Button>
          <Button
            disabled={!hasSelection}
            onClick={() => setOpenDialog('bulkDelete')}
            variant='destructive'
          >
            <Trash2 aria-hidden='true' />
            {t('claimRequests.actions.bulkDelete')}
          </Button>
        </>
      ) : null}
      {canAdmin ? (
        <>
          <Button
            disabled={!hasSelection}
            onClick={() => setOpenDialog('bulkGenerateAndSend')}
            variant='secondary'
          >
            <Send aria-hidden='true' />
            {t('claimRequests.actions.generateAndSend')}
          </Button>
          <Button
            disabled={!hasSelection}
            onClick={() => setOpenDialog('bulkInquiryFanavaran')}
          >
            {t('claimRequests.actions.inquiryFanavaran')}
          </Button>
        </>
      ) : null}
      <Button onClick={() => void download()} variant='outline'>
        <Download aria-hidden='true' />
        {t('claimRequests.actions.downloadExcel')}
      </Button>
      <Button disabled={isFetching} onClick={onRefresh} variant='outline'>
        <RefreshCw
          aria-hidden='true'
          className={isFetching ? 'animate-spin' : undefined}
        />
        {t('claimRequests.refresh')}
      </Button>
    </div>
  )
}
