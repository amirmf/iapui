import { useEffect, useRef } from 'react'

import { AssessmentItemAdjustmentDeleteDialog } from '@features/assessment-items/components/assessment-item-adjustment-delete-dialog'
import { AssessmentItemAdjustmentDialog } from '@features/assessment-items/components/assessment-item-adjustment-dialog'
import { AssessmentItemConfirmDialogs } from '@features/assessment-items/components/assessment-item-confirm-dialogs'
import { AssessmentItemDeleteDialog } from '@features/assessment-items/components/assessment-item-delete-dialog'
import { AssessmentItemDoctorLookupDialog } from '@features/assessment-items/components/assessment-item-doctor-lookup-dialog'
import AssessmentItemForm from '@features/assessment-items/components/assessment-item-form'
import { AssessmentItemHeaderActions } from '@features/assessment-items/components/assessment-item-header-actions'
import { AssessmentItemsCardList } from '@features/assessment-items/components/assessment-items-editable-card-list'
import { PreAuthInquiriesDialog } from '@features/assessment-items/components/pre-auth-inquiries-dialog'
import { useAssessmentItem } from '@features/assessment-items/context/store/assessment-item-store'
import { useIsSuperAdmin } from '@features/assessment-items/queries/use-assessment-access'
import { useClaimRequestIgnoreRoles } from '@features/assessment-items/queries/use-assessment-access'
import { useClaimRequestStatusAssessment } from '@features/assessment-items/queries/use-assessment-access'
import useAssessmentItemsData from '@features/assessment-items/queries/useAssessmentItemsData.ts'
import { type ClaimRequest } from '@iap/api-types'
import { Permission } from '@iap/ui'
import { Button } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { IconPlus } from '@tabler/icons-react'

interface AssessmentItemsContent {
  claimRequest?: ClaimRequest
  claimRequestId?: string
}

export function AssessmentItemsContent(props: AssessmentItemsContent) {
  const { claimRequest, claimRequestId } = props
  const { t } = useTranslate()
  const { open, setOpen } = useAssessmentItem()
  const isSuperAdmin = useIsSuperAdmin()
  const assessmentListRef = useRef<HTMLDivElement>(null)
  const isIgnoreRoles = useClaimRequestIgnoreRoles()

  const claimRequestStatus = useClaimRequestStatusAssessment(claimRequest)
  const {
    data: items,
    isLoading,
    refetch,
    isFetching,
  } = useAssessmentItemsData(claimRequestId)

  const assessmentItems = items ?? []

  useEffect(() => {
    if (open === 'create') {
      assessmentListRef.current?.scrollTo({ top: 1000000, behavior: 'smooth' })
    }
  }, [open])

  const assessmentItemsFormCondition =
    (claimRequestStatus || isSuperAdmin) &&
    (open === 'create' || !assessmentItems.length) &&
    !isIgnoreRoles

  const createButtonAssessmentItemsCondition =
    (claimRequestStatus || isSuperAdmin) &&
    open !== 'create' &&
    !!assessmentItems.length &&
    !isIgnoreRoles

  return (
    <>
      <div className='flex max-h-[75vh] flex-col overflow-hidden'>
        <div className='mb-3 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <h2 className='text-sm font-semibold'>
              {t('assessmentItems.title')}
            </h2>
          </div>
          <AssessmentItemHeaderActions
            isLoading={isFetching || isLoading}
            canViewPreAuths={
              claimRequest?.extPolicyId != null &&
              !!claimRequest.extNationalCode
            }
            onRefresh={refetch}
          />
        </div>

        <div
          ref={assessmentListRef}
          id='assessment-items-list'
          className='flex-1 overflow-auto'
        >
          {/* Create/Edit Accordion Form */}
          <AssessmentItemsCardList
            items={assessmentItems.concat([]).reverse()}
            isLoading={isLoading}
            claimRequest={claimRequest}
            claimRequestId={claimRequestId}
            showEmptyMessage={!assessmentItemsFormCondition}
          />
          <Permission hasPermission={assessmentItemsFormCondition}>
            <AssessmentItemForm
              claimRequestData={claimRequest}
              claimRequestId={claimRequestId}
              className='rounded border border-gray-300'
            />
          </Permission>
          <Permission hasPermission={createButtonAssessmentItemsCondition}>
            <div className='flex items-center justify-center'>
              <Button
                presentation='reference'
                size='sm'
                onClick={() => setOpen('create')}
                className='mb-5 space-x-2'
                disabled={open === 'create'}
              >
                <IconPlus size={18} />
                <span>{t('assessmentItems.create')}</span>
              </Button>
            </div>
          </Permission>
        </div>
      </div>

      <AssessmentItemDeleteDialog />
      <AssessmentItemAdjustmentDeleteDialog />
      <AssessmentItemAdjustmentDialog
        claimRequestId={claimRequestId}
        claimRequest={claimRequest}
      />
      <AssessmentItemConfirmDialogs />

      <PreAuthInquiriesDialog
        policyId={claimRequest?.extPolicyId}
        nationalCode={claimRequest?.extNationalCode}
        displayName={claimRequest?.extDisplayName}
      />

      <AssessmentItemDoctorLookupDialog />
    </>
  )
}
