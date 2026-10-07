import { useState } from 'react'

import { ClaimRequestAssignDialog } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-assignment-section/claim-request-assign-dialog'
import useClaimRequestManagementData from '@features/claim-requests/queries/use-claim-request-management-data'
import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/route-adapters/use-claim-request-management-params'
import { useIsSuperAdmin } from '@features/claim-requests/route-adapters/use-claim-request-management-permissions'
import { useClaimRequestRolesActions } from '@features/claim-requests/route-adapters/use-claim-request-management-permissions'
import { useClaimRequestStatusAssessment } from '@features/claim-requests/route-adapters/use-claim-request-management-permissions'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

export function ClaimRequestAssignmentSection() {
  const { t } = useTranslation()
  const isSuperAdmin = useIsSuperAdmin()
  const isRolesAction = useClaimRequestRolesActions()
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const { data: claimRequest, refetch } = useClaimRequestManagementData()

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const claimRequestAssigneeId =
    (claimRequest as { assigneeId?: string | null } | undefined)?.assigneeId ??
    claimRequest?.assignedUserId

  const statusCondition = useClaimRequestStatusAssessment(claimRequest)
  const canAssign = isSuperAdmin || (isRolesAction && statusCondition)

  return (
    <>
      <Button
        type='button'
        variant='secondary'
        size='xs'
        onClick={() => setIsAssignDialogOpen(true)}
        disabled={!claimRequest}
      >
        {canAssign
          ? t('claimRequests.assignment.assignButton')
          : t('claimRequests.assignment.history.title')}
      </Button>

      <ClaimRequestAssignDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        claimRequestId={claimRequestId}
        assignedId={claimRequestAssigneeId}
        defaultTarget='doctor'
        canAssign={canAssign}
        onAssigned={() => void refetch()}
      />
    </>
  )
}
