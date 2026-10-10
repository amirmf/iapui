import { useCallback, useMemo, useState } from 'react'

import { ClaimRequestReplayDialog } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-replay-section/claim-request-replay-dialog'
import { type ClaimRequestReplayForm } from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-params'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function ClaimRequestReplayButton() {
  const { t } = useTranslation()
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const { data: claimRequest, refetch } = useClaimRequestManagementData()
  const [open, setOpen] = useState(false)
  const replayAssigneeId = useMemo(() => {
    const assignmentHistory = Array.isArray(claimRequest?.assignmentHistory)
      ? claimRequest.assignmentHistory
      : []
    const latestAssignment = assignmentHistory[assignmentHistory.length - 1]

    return latestAssignment?.assignedByUserId ?? null
  }, [claimRequest])

  const { isPending, mutate } = useMutation({
    mutationFn: (replayFormValues: ClaimRequestReplayForm) =>
      claimRequestService.assign(claimRequestId, {
        assigneeId: replayAssigneeId as string,
        description: replayFormValues.description,
        claimRequestStatus: 'IN_ASSESSMENT',
      }),
    onSuccess: () => {
      toast.success(t('claimRequests.messages.assignmentSuccess'))
      setOpen(false)
      void refetch()
    },
  })

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen)
  }, [])

  const handleCancel = useCallback(() => setOpen(false), [])
  const handleSubmit = useCallback(
    (values: ClaimRequestReplayForm) => {
      if (!replayAssigneeId) {
        toast.error(t('claimRequests.messages.assignmentError'))
        return
      }

      mutate(values)
    },
    [mutate, replayAssigneeId, t]
  )

  return (
    <>
      <Button
        type='button'
        size='xs'
        onClick={() => setOpen(true)}
        disabled={isPending || !replayAssigneeId}
      >
        {t('claimRequests.replay.button')}
      </Button>
      <ClaimRequestReplayDialog
        assignmentHistory={claimRequest?.assignmentHistory}
        isPending={isPending}
        open={open}
        onCancel={handleCancel}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
      />
    </>
  )
}
