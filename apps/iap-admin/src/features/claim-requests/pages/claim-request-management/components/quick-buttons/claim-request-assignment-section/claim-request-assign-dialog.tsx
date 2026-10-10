import { ClaimRequestAssignmentHistory } from '@features/claim-requests/pages/claim-request-management/components/claim-request-assignment-history'
import { ClaimRequestAssignForm } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-assignment-section/claim-request-assign-form'
import type { ClaimRequestAssigneeFieldsForm } from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import { useAuthSession as useAuth } from '@iap/auth'
import { Permission } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export type ClaimRequestAssignTarget = 'user' | 'doctor'

interface ClaimRequestAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  claimRequestId: string
  assignedId?: string | null
  onAssigned?: () => void
  defaultTarget?: ClaimRequestAssignTarget
  canAssign?: boolean
}

export function ClaimRequestAssignDialog(props: ClaimRequestAssignDialogProps) {
  const {
    open,
    onOpenChange,
    claimRequestId,
    assignedId,
    onAssigned,
    defaultTarget = 'user',
    canAssign,
  } = props
  const { t } = useTranslation()
  const { data: claimRequest } = useClaimRequestManagementData()
  const { user } = useAuth()

  const assignMutation = useMutation({
    mutationFn: ({ assigneeId, description }: ClaimRequestAssigneeFieldsForm) =>
      claimRequestService.assign(claimRequestId, {
        assigneeId: assigneeId as string,
        description: description.trim(),
        claimRequestStatus: 'DELEGATED',
      }),
    onSuccess: () => {
      toast.success(t('claimRequests.messages.assignmentSuccess'))
      onAssigned?.()
      onOpenChange(false)
    },
  })

  const title = canAssign
    ? t('claimRequests.assignment.title')
    : t('claimRequests.assignment.history.title')

  const descriptionText = canAssign
    ? t('claimRequests.assignment.dialogDescription')
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent presentation='reference' className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>

        <ClaimRequestAssignmentHistory
          assignmentHistory={claimRequest?.assignmentHistory}
        />

        <Permission hasPermission={!!canAssign}>
          <ClaimRequestAssignForm
            open={open}
            extPolicyId={claimRequest?.extPolicyId}
            assignedId={assignedId}
            defaultTarget={defaultTarget}
            isPending={assignMutation.isPending}
            onCancel={() => onOpenChange(false)}
            onSubmit={(values) => assignMutation.mutate(values)}
            // branchLocationId={claimRequest?.extWorkUnitCode?.toString()}
            parentUserAccountId={user?.parentUserAccountId}
          />
        </Permission>
      </DialogContent>
    </Dialog>
  )
}
