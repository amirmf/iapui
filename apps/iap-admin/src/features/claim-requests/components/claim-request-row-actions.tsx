import { useClaimRequestStore } from '@features/claim-requests/context/store/claim-request-store'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import type { ClaimRequest } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Permission } from '@iap/ui'
import { TableActionButton, TableActions } from '@shared/tables'
import {
  IconBell,
  IconEye,
  IconTrash,
  IconUserEdit,
  IconUserMinus,
} from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type ClaimRequestRowActionsProps = {
  row: Row<ClaimRequest>
}

export function ClaimRequestRowActions(props: ClaimRequestRowActionsProps) {
  const { row } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const location = useLocation()
  const claimRequest = row.original
  const quickStatus = (location.search as Record<string, unknown>).quickStatus
  const isQuickStatusAll =
    quickStatus === 'ALL' ||
    (Array.isArray(quickStatus) &&
      quickStatus.length === 1 &&
      quickStatus[0] === 'ALL')
  const setCurrentRow = useClaimRequestStore((state) => state.setCurrentRow)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const isSuperAdmin = isSuperAdminRole(user?.roles ?? [])
  const canAssignToMe =
    isQuickStatusAll &&
    !claimRequest.assignedUserUsername &&
    claimRequest.status === 'IN_ASSESSMENT'
  const canRemoveMyAssessment =
    !quickStatus ||
    quickStatus === 'IN_ASSESSMENT' ||
    (Array.isArray(quickStatus) && quickStatus.includes('IN_ASSESSMENT'))
  const sendNotificationMutation = useMutation({
    mutationFn: claimRequestService.sendStatusChangeNotification,
    onSuccess: () =>
      toast.success(t('claimRequests.messages.statusChangeNotificationSent')),
  })

  const openDialog = (
    dialog: 'assignToMe' | 'delete' | 'removeMyAssessment'
  ) => {
    setCurrentRow(claimRequest)
    setOpenDialog(dialog)
  }

  const sendStatusChangeNotification = () => {
    if (!claimRequest.id) {
      toast.error(t('claimRequests.messages.claimIdMissing'))
      return
    }

    sendNotificationMutation.mutate(claimRequest.id)
  }

  const openRemoveMyAssessmentDialog = () => {
    if (!claimRequest.id) {
      toast.error(t('claimRequests.messages.claimIdMissing'))
      return
    }
    if (!claimRequest.docType?.id) {
      toast.error(
        t('claimRequests.messages.docTypeUpdateFailed', {
          defaultValue: 'claimRequests.messages.docTypeUpdateFailed',
        })
      )
      return
    }

    openDialog('removeMyAssessment')
  }

  return (
    <TableActions>
      <Link
        params={{ claimRequestId: claimRequest.id! }}
        to='/claim-requests/$claimRequestId/claim-request-management/'
      >
        <TableActionButton
          presentation='reference'
          icon={<IconEye aria-hidden='true' className='size-5' />}
          label={t('claimRequests.actions.view', {
            defaultValue: 'claimRequests.actions.view',
          })}
          tooltipText={t('claimRequests.actions.viewDetails')}
        />
      </Link>

      <Permission hasPermission={canAssignToMe}>
        <TableActionButton
          presentation='reference'
          icon={<IconUserEdit aria-hidden='true' className='size-5' />}
          label={t('claimRequests.actions.assignToMe')}
          tooltipText={t('claimRequests.actions.assignToMe')}
          onClick={() => openDialog('assignToMe')}
          variant='success'
        />
      </Permission>
      <Permission hasPermission={canRemoveMyAssessment}>
        <TableActionButton
          presentation='reference'
          icon={<IconUserMinus aria-hidden='true' className='size-5' />}
          label={t('claimRequests.actions.removeMyAssessment')}
          onClick={openRemoveMyAssessmentDialog}
          tooltipText={t('claimRequests.actions.removeMyAssessment')}
          variant='destructive'
        />
      </Permission>
      <Permission hasPermission={isSuperAdmin}>
        <TableActionButton
          presentation='reference'
          disabled={sendNotificationMutation.isPending}
          icon={<IconBell aria-hidden='true' className='size-5' />}
          label={t('claimRequests.actions.sendStatusChangeNotification')}
          onClick={sendStatusChangeNotification}
          tooltipText={t('claimRequests.actions.sendStatusChangeNotification')}
        />
        <TableActionButton
          presentation='reference'
          icon={<IconTrash aria-hidden='true' className='size-5' />}
          label={t('claimRequests.actions.delete')}
          onClick={() => openDialog('delete')}
          tooltipText={t('claimRequests.actions.delete')}
          variant='destructive'
        />
      </Permission>
    </TableActions>
  )
}
