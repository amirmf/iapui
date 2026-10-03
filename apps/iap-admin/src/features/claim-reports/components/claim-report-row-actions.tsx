import { TableActionButton, TableActions } from '@shared/tables'
import {
  IconExternalLink,
  IconFileTypePdf,
  IconFileTypeXls,
} from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { outpatientDocAcceptanceService } from '../services/outpatient-doc-acceptance-service'

type ClaimReportRowActionsProps = {
  extId: number | string | null | undefined
  outpatientDocAcceptanceId: string | null | undefined
}

export function ClaimReportRowActions(props: ClaimReportRowActionsProps) {
  const { extId, outpatientDocAcceptanceId } = props
  const { t } = useTranslation()
  const hasOutpatientDocAcceptanceId = Boolean(outpatientDocAcceptanceId)
  const hasExtId = extId !== null && extId !== undefined && extId !== ''
  const claimRequestsHref = hasExtId
    ? `/claim-requests?outpatientDocAcceptanceExtId=${encodeURIComponent(
        String(extId)
      )}&quickStatus=ALL`
    : undefined
  const downloadExcelMutation = useMutation({
    mutationFn: () => {
      if (!outpatientDocAcceptanceId) {
        throw new Error('Outpatient document acceptance ID is missing')
      }

      return outpatientDocAcceptanceService.exportReport({
        outpatientDocAcceptanceId,
      })
    },
    onSuccess: (blob) => {
      saveAs(blob, `claim-report-${extId}.xlsx`)
      toast.success(t('claimReports.messages.excelDownloaded'))
    },
  })
  const downloadPdfMutation = useMutation({
    mutationFn: () => {
      if (!outpatientDocAcceptanceId) {
        throw new Error('Outpatient document acceptance ID is missing')
      }

      return outpatientDocAcceptanceService.exportPdfReport({
        outpatientDocAcceptanceId,
      })
    },
    onSuccess: (blob) => {
      saveAs(blob, `claim-report-${extId}.pdf`)
      toast.success(t('claimReports.messages.pdfDownloaded'))
    },
  })

  return (
    <TableActions>
      <TableActionButton
        disabled={
          !hasOutpatientDocAcceptanceId || downloadExcelMutation.isPending
        }
        icon={<IconFileTypeXls className='size-5' />}
        label={t('claimReports.actions.downloadExcel')}
        onClick={() => downloadExcelMutation.mutate()}
        tooltipText={t('claimReports.actions.downloadExcel')}
        variant='success'
      />
      <TableActionButton
        disabled={
          !hasOutpatientDocAcceptanceId || downloadPdfMutation.isPending
        }
        icon={<IconFileTypePdf className='size-5' />}
        label={t('claimReports.actions.downloadPdf')}
        onClick={() => downloadPdfMutation.mutate()}
        tooltipText={t('claimReports.actions.downloadPdf')}
        variant='destructive'
      />
      {claimRequestsHref ? (
        <Link
          target='_blank'
          rel='noopener noreferrer'
          to={claimRequestsHref as never}
        >
          <TableActionButton
            icon={<IconExternalLink className='size-5' />}
            label={t('claimReports.actions.openClaimRequests')}
            tooltipText={t('claimReports.actions.openClaimRequests')}
          />
        </Link>
      ) : (
        <TableActionButton
          disabled
          icon={<IconExternalLink className='size-5' />}
          label={t('claimReports.actions.openClaimRequests')}
          tooltipText={t('claimReports.actions.openClaimRequests')}
        />
      )}
    </TableActions>
  )
}
