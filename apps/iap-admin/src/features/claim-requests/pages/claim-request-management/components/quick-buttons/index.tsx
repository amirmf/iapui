import { ClaimRequestAssignToMeButton } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-assign-to-me-button'
import { ClaimRequestAssignmentSection } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-assignment-section/index'
import { ClaimRequestReplayButton } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-replay-section/index'
import ClaimRequestReturnInAssessmentButton from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-return-inAssessment-button'
import { ClaimRequestReviewLaterButton } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-review-later-button'
import ClaimRequestStatusButton from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/claim-request-status-button'
import { ClaimRequestIhioPrescriptionsByPrintCodeSection } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-ihio-print-code-section/index'
import {
  ClaimRequestTaminDrugPrescriptionsSection,
  ClaimRequestTaminOfficeServicesSection,
  ClaimRequestTaminParaClinicPrescriptionsSection,
} from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/index'
import { ReturnFromPaymentSection } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/return-from-payment-section/index'
import { ReturnFromPaymentSendAgainSection } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/return-from-payment-send-again-section/index'
import useClaimRequestManagementData from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-management-data'
import { useClaimRequestManagementPermissions } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-claim-request-management-permissions'
import { useAuthSession as useAuth } from '@iap/auth'
import { Permission } from '@iap/ui'

function ClaimRequestQuickButtons() {
  const { data: claimRequest } = useClaimRequestManagementData()
  const {
    isSuperAdmin,
    isAdmin,
    isRolesActions,
    isBranch,
    isHq,
    isDoctor,
    isDevelopMode,
  } = useClaimRequestManagementPermissions()
  const { user } = useAuth()

  const reviewLaterStatus = claimRequest?.status === 'IN_ASSESSMENT'
  const reviewLaterStatusCondition = isRolesActions && reviewLaterStatus

  const returnToInAssessmentStatus =
    claimRequest?.status === 'RETURN' ||
    claimRequest?.status === 'REJECTED' ||
    claimRequest?.status === 'DELEGATED' ||
    claimRequest?.status === 'DEDICATED_TO_USER' ||
    claimRequest?.status === 'APPROVED'

  const returnToInAssessmentCondition =
    isSuperAdmin || (isRolesActions && returnToInAssessmentStatus)
  const replayStatus = claimRequest?.status === 'DELEGATED'
  const isCurrentUser = claimRequest?.assignedUserId === user?.id
  const replayStatusCondition =
    (isDoctor || isSuperAdmin) && replayStatus && isCurrentUser

  const canAssignToMeStatus =
    claimRequest?.status === 'IN_ASSESSMENT' ||
    claimRequest?.status === 'DELEGATED'
  const canAssignToMeCondition = isRolesActions && canAssignToMeStatus

  // const updateDocTypeStatus =
  //   claimRequest?.status === 'IN_ASSESSMENT' ||
  //   claimRequest?.status === 'SENT_FAILED'
  // const updateDocTypeCondition =
  //   isSuperAdmin || (isRolesActions && updateDocTypeStatus)

  const returnFromPaymentStatusCondition =
    claimRequest?.status === 'PAID' || claimRequest?.status === 'SENT'

  const returnFromPaymentCondition =
    (isAdmin || isBranch || isHq) && returnFromPaymentStatusCondition

  const returnFromPaymentSendAgainStatusCondition =
    claimRequest?.status === 'PAID' ||
    claimRequest?.status === 'SENT' ||
    claimRequest?.status === 'PAYMENT_RETURN'

  const returnFromPaymentSendAgainCondition =
    (isAdmin || isBranch || isHq) && returnFromPaymentSendAgainStatusCondition
  return (
    <>
      <Permission hasPermission={isSuperAdmin}>
        <ClaimRequestStatusButton />
      </Permission>
      <Permission hasPermission={returnToInAssessmentCondition}>
        <ClaimRequestReturnInAssessmentButton />
      </Permission>
      <Permission hasPermission={reviewLaterStatusCondition}>
        <ClaimRequestReviewLaterButton />
      </Permission>
      <Permission hasPermission={returnFromPaymentCondition}>
        <ReturnFromPaymentSection />
      </Permission>
      <Permission hasPermission={returnFromPaymentSendAgainCondition}>
        <ReturnFromPaymentSendAgainSection />
      </Permission>
      {/*<Permission hasPermission={updateDocTypeCondition}>*/}
      {/*  <ClaimRequestUpdateInfoSection />*/}
      {/*</Permission>*/}
      <Permission hasPermission={canAssignToMeCondition}>
        <ClaimRequestAssignToMeButton />
      </Permission>
      <Permission hasPermission={replayStatusCondition}>
        <ClaimRequestReplayButton />
      </Permission>
      <Permission hasPermission={isRolesActions}>
        <ClaimRequestAssignmentSection />
      </Permission>
      <Permission hasPermission={isDevelopMode}>
        <ClaimRequestTaminDrugPrescriptionsSection />
        <ClaimRequestTaminParaClinicPrescriptionsSection />
        <ClaimRequestTaminOfficeServicesSection />
        <ClaimRequestIhioPrescriptionsByPrintCodeSection />
      </Permission>
    </>
  )
}

export default ClaimRequestQuickButtons
