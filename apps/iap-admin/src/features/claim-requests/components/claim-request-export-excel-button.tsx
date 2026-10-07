import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button } from '@iap/ui'
import { IconDownload } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type ClaimRequestExportExcelButtonProps = {
  filters: ApiFilterParams
  exportExcel?: (params: {
    filters?: ApiFilterParams
    signal?: AbortSignal
  }) => Promise<Blob>
}

export function ClaimRequestExportExcelButton(
  props: ClaimRequestExportExcelButtonProps
) {
  const { filters, exportExcel = claimRequestService.exportPageLiteExcel } =
    props
  const { t } = useTranslation()
  const exportMutation = useMutation({
    mutationFn: () => exportExcel({ filters }),
    onSuccess: (blob) => {
      saveAs(blob, 'claim-requests.xlsx')
      toast.success(t('claimRequests.messages.excelDownloaded'))
    },
  })

  return (
    <Button
      type='button'
      presentation='reference'
      className='space-x-2'
      disabled={exportMutation.isPending}
      onClick={() => exportMutation.mutate()}
      variant='outline'
    >
      <IconDownload aria-hidden='true' size={18} />
      <span>{t('claimRequests.actions.downloadExcel')}</span>
    </Button>
  )
}
