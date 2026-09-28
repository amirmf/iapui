import type { ApiFilterParams } from '@iap/shared-lib'
import { Button } from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { claimRequestService } from '../services/claim-request-service'

type ClaimRequestExportExcelButtonProps = {
  filters: ApiFilterParams
}

export function ClaimRequestExportExcelButton({
  filters,
}: ClaimRequestExportExcelButtonProps) {
  const { t } = useTranslation()
  const exportMutation = useMutation({
    mutationFn: () => claimRequestService.exportPageLiteExcel(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'claim-requests.xlsx'
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success(t('claimRequests.messages.excelDownloaded'))
    },
    onError: () => toast.error(t('claimRequests.messages.excelDownloadFailed')),
  })

  return (
    <Button
      className='space-x-2'
      disabled={exportMutation.isPending}
      onClick={() => exportMutation.mutate()}
      variant='outline'
    >
      <Download aria-hidden='true' className='size-4' />
      <span>{t('claimRequests.actions.downloadExcel')}</span>
    </Button>
  )
}
