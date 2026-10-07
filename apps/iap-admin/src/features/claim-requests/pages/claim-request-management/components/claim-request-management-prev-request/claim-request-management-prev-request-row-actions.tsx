import { useClaimRequestManagementPrevRequestAttachments } from '@features/claim-requests/pages/claim-request-management/context/store/claim-request-management-prev-request-attachments-store'
import { type ClaimRequestHistory } from '@iap/api-types'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { TableActionButton } from '@shared/tables'
import { TableActions } from '@shared/tables'
import { IconEye, IconPhoto } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'

interface ClaimRequestManagementPrevRequestRowActionsProps {
  row: Row<ClaimRequestHistory>
}

function ClaimRequestManagementPrevRequestRowActions(
  props: ClaimRequestManagementPrevRequestRowActionsProps
) {
  const { row } = props
  const { t } = useTranslation()
  const claimRequest = row.original
  const openAttachmentsDialog = useClaimRequestManagementPrevRequestAttachments(
    (state) => state.openDialog
  )

  return (
    <TableActions>
      <TableActionButton
        presentation='reference'
        icon={<IconPhoto className='size-5' />}
        variant='success'
        label={t('claimRequests.duplicates.actions.picture')}
        tooltipText={t('claimRequests.duplicates.actions.picture')}
        disabled={!claimRequest.id}
        onClick={() =>
          claimRequest.id && openAttachmentsDialog('prevTable', claimRequest.id)
        }
      />
      <Link
        to='/claim-requests/$claimRequestId/claim-request-management/'
        params={{ claimRequestId: claimRequest.id! }}
        target='_blank'
      >
        <TableActionButton
          presentation='reference'
          icon={<IconEye className='size-5' />}
          label={t('claimRequests.actions.view', {
            defaultValue: 'claimRequests.actions.view',
          })}
          tooltipText={t('claimRequests.actions.viewDetails')}
        />
      </Link>
    </TableActions>
  )
}

export default ClaimRequestManagementPrevRequestRowActions
