import { useMemo, useState } from 'react'

import { CLAIM_REQUEST_STATUS_TRANSLATION_KEYS } from '@features/claim-requests/model/claim-request-status'
import RefreshPolicyDetailsButton from '@features/claim-requests/pages/claim-request-management/components/action-buttons/refresh-policy-details-button'
import StartCoreAiWorkflowButton from '@features/claim-requests/pages/claim-request-management/components/action-buttons/start-core-ai-workflow-button'
import { isClaimRequestStatus } from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-status'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { useClaimRequestManagementParams as useParams } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-params'
import { useIsSuperAdmin } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-permissions'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
import coreAiService from '@features/claim-requests/pages/claim-request-management/services/core-ai-management-service'
import { useAuthSession as useAuth } from '@iap/auth'
import { ConfirmDialog } from '@iap/dialogs'
import { Permission } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

function ClaimRequestManagementActionBtn() {
  const { refetch } = useClaimRequestManagementData()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { claimRequestId } = useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
  const isSuperAdmin = useIsSuperAdmin()

  const coreAiApproveWorkflowMutation = useMutation({
    mutationFn: () =>
      coreAiService.approveDataExtractionWorkflow(claimRequestId),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.coreAiWorkflowApproved'))
      await refetch()
    },
  })

  const normalizedInitiatedBy = useMemo(() => {
    const candidateId = user?.id?.trim()

    if (candidateId) {
      return candidateId
    }

    const candidateUsername = user?.username?.trim()

    if (candidateUsername) {
      return candidateUsername
    }

    return 'system'
  }, [user])

  const coreAiWorkflowMutation = useMutation({
    mutationFn: () =>
      coreAiService.startDataExtractionWorkflow({
        claimRequestId,
        workflowId: claimRequestId,
        initiatedBy: normalizedInitiatedBy,
      }),
    onSuccess: (response) => {
      const statusLabel = response.status
        ? isClaimRequestStatus(response.status)
          ? t(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[response.status])
          : response.status
        : t('claimRequests.messages.coreAiWorkflowStatusUnknown')

      toast.success(
        t('claimRequests.messages.coreAiWorkflowStarted', {
          status: statusLabel,
        })
      )
    },
  })

  const refreshPolicyDetailsMutation = useMutation({
    mutationFn: () => claimRequestService.refreshPolicyDetails(claimRequestId),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.policyDetailsUpdated'))
      await refetch()
    },
  })

  const [activeConfirmation, setActiveConfirmation] = useState<
    | 'approveCoreAiWorkflow'
    | 'startCoreAiWorkflow'
    | 'refreshPolicyDetails'
    | null
  >(null)

  const handleApproveCoreAiWorkflow = () => {
    coreAiApproveWorkflowMutation.mutate()
  }

  const handleStartCoreAiWorkflow = () => {
    coreAiWorkflowMutation.mutate()
  }

  const handleRefreshPolicyDetails = () => {
    refreshPolicyDetailsMutation.mutate()
  }

  const isSubmitDisabled =
    coreAiApproveWorkflowMutation.isPending ||
    coreAiWorkflowMutation.isPending ||
    refreshPolicyDetailsMutation.isPending

  return (
    <div className='mt-5 flex flex-wrap items-center justify-end gap-3'>
      <Permission hasPermission={isSuperAdmin}>
        {/*<ApproveCoreAiWorkflowButton*/}
        {/*  visible={data?.status === 'DATA_ENTRY'}*/}
        {/*  coreAiWorkflowMutationPending={coreAiWorkflowMutation.isPending}*/}
        {/*  submitDisabled={isSubmitDisabled}*/}
        {/*  onClick={() => setActiveConfirmation('approveCoreAiWorkflow')}*/}
        {/*/>*/}
        <StartCoreAiWorkflowButton
          coreAiWorkflowMutationPending={coreAiWorkflowMutation.isPending}
          coreAiApproveWorkflowMutationPending={
            coreAiApproveWorkflowMutation.isPending
          }
          submitDisabled={isSubmitDisabled}
          onClick={() => setActiveConfirmation('startCoreAiWorkflow')}
        />
        <RefreshPolicyDetailsButton
          visible
          submitDisabled={isSubmitDisabled}
          isPending={refreshPolicyDetailsMutation.isPending}
          onClick={() => setActiveConfirmation('refreshPolicyDetails')}
        />
      </Permission>

      <ConfirmDialog
        presentation='reference'
        open={activeConfirmation === 'approveCoreAiWorkflow'}
        onOpenChange={(open) => !open && setActiveConfirmation(null)}
        title={t('claimRequests.confirmations.approveCoreAiWorkflow.title')}
        description={t(
          'claimRequests.confirmations.approveCoreAiWorkflow.description'
        )}
        onConfirm={() => {
          setActiveConfirmation(null)
          handleApproveCoreAiWorkflow()
        }}
        isLoading={coreAiApproveWorkflowMutation.isPending}
        disableConfirm={isSubmitDisabled}
      />
      <ConfirmDialog
        presentation='reference'
        open={activeConfirmation === 'startCoreAiWorkflow'}
        onOpenChange={(open) => !open && setActiveConfirmation(null)}
        title={t('claimRequests.confirmations.startCoreAiWorkflow.title')}
        description={t(
          'claimRequests.confirmations.startCoreAiWorkflow.description'
        )}
        onConfirm={() => {
          setActiveConfirmation(null)
          handleStartCoreAiWorkflow()
        }}
        isLoading={coreAiWorkflowMutation.isPending}
        disableConfirm={isSubmitDisabled}
      />
      <ConfirmDialog
        presentation='reference'
        open={activeConfirmation === 'refreshPolicyDetails'}
        onOpenChange={(open) => !open && setActiveConfirmation(null)}
        title={t('claimRequests.confirmations.refreshPolicyDetails.title')}
        description={t(
          'claimRequests.confirmations.refreshPolicyDetails.description'
        )}
        onConfirm={() => {
          setActiveConfirmation(null)
          handleRefreshPolicyDetails()
        }}
        isLoading={refreshPolicyDetailsMutation.isPending}
        disableConfirm={isSubmitDisabled}
      />
    </div>
  )
}

export default ClaimRequestManagementActionBtn
