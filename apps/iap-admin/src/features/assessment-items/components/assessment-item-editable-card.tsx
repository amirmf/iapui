import { useState } from 'react'

import AssessmentItemCardAdjustment from '@features/assessment-items/components/assessment-item-card-editable-adjustment.tsx'
import AssessmentItemCardFanavarnCalc from '@features/assessment-items/components/assessment-item-card-fanavarn-calc.tsx'
import { AssessmentItemCardRowActions } from '@features/assessment-items/components/assessment-item-card-row-actions.tsx'
import AssessmentItemCardRowData from '@features/assessment-items/components/assessment-item-card-row-data.tsx'
import AssessmentItemForm from '@features/assessment-items/components/assessment-item-form'
import type { AssessmentItem } from '@iap/api-types'
import type { ClaimRequest, SubInsuredPersonResponse } from '@iap/api-types'
import type { DmgCase } from '@iap/api-types'
import { Button } from '@iap/ui'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@iap/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@iap/ui'
import { LongText } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { IconEye } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

interface AssessmentItemCardProps {
  item: AssessmentItem
  deleteAccess: boolean
  adjustmentAccess: boolean
  claimRequestId?: string
  claimRequest?: ClaimRequest
  overrideInsuredPerson?: SubInsuredPersonResponse
  fanavaranCalculationResult?: DmgCase[]
  mode?: 'default' | 'readonly'
}

function AssessmentItemCard(props: AssessmentItemCardProps) {
  const {
    item,
    deleteAccess,
    adjustmentAccess,
    claimRequestId,
    claimRequest,
    overrideInsuredPerson,
    fanavaranCalculationResult,
    mode = 'default',
  } = props
  const { t } = useTranslate()
  const [isEdit, setIsEdited] = useState(false)
  const floatingCoverageValue =
    item.overrideInsuredPersonId == null
      ? undefined
      : overrideInsuredPerson?.fullName && overrideInsuredPerson.nationalCode
        ? `${overrideInsuredPerson.fullName} (${overrideInsuredPerson.nationalCode})`
        : (overrideInsuredPerson?.fullName ??
          overrideInsuredPerson?.nationalCode ??
          String(item.overrideInsuredPersonId))

  return (
    <Card className='h-full w-full gap-3 rounded border-gray-400 py-1 shadow-none'>
      <CardHeader className='flex flex-wrap items-center justify-between border-b px-2 py-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='line-clamp-1 flex-1'>
              <CardTitle className='text-sm'>
                {item.damageCode?.code && (
                  <span>{item.damageCode?.code}: </span>
                )}
                {item.damageCode?.title && (
                  <span>{item.damageCode?.title}</span>
                )}
              </CardTitle>
            </div>
          </TooltipTrigger>
          <TooltipContent presentation='reference'>
            {item?.damageCode?.title}
          </TooltipContent>
        </Tooltip>
        {mode === 'default' ? (
          <div className='flex items-center gap-1'>
            <AssessmentItemCardRowActions
              deleteAccess={deleteAccess}
              adjustmentAccess={adjustmentAccess}
              assessmentItem={item}
              onEdit={() => setIsEdited((prevState) => !prevState)}
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className='px-2'>
        <AssessmentItemCardRowData
          amount={item.amount}
          estimatedAmount={item.estimatedAmount}
          franchizeDeductionAmount={item.franchizeDeductionAmount}
          quantity={item.quantity}
          remainCoverageAmount={item.remainCoverageAmount}
          toothNumber={item.toothNumber}
          toothNumbers={item.toothNumbers}
          floatingCoverage={floatingCoverageValue}
        />
        {item.claimRequestAdjustment && (
          <AssessmentItemCardAdjustment
            assessmentItem={item}
            item={item.claimRequestAdjustment}
            adjustmentAccess={adjustmentAccess}
          />
        )}
        {fanavaranCalculationResult?.length ? (
          <AssessmentItemCardFanavarnCalc
            calculationResults={fanavaranCalculationResult}
          />
        ) : null}
        {item.description && (
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              {t('assessmentItems.dialog.fields.description')}
            </p>
            <LongText className='mt-1 text-sm'>{item.description}</LongText>
          </div>
        )}
      </CardContent>
      {mode === 'default' ? (
        <CardFooter className='justify-end'>
          {item.claimRequestAdjustment?.adjClaimRequestId ? (
            <Link
              to='/claim-requests/$claimRequestId/claim-request-management/'
              params={{
                claimRequestId: item.claimRequestAdjustment?.adjClaimRequestId,
              }}
            >
              <Button
                presentation='reference'
                type='button'
                variant='outline'
                size='sm'
                className='w-full'
              >
                <IconEye className='h-4 w-4' />
                {t('claimRequests.actions.viewDetailsAdjustment')}
              </Button>
            </Link>
          ) : null}
        </CardFooter>
      ) : null}
      {mode === 'default' && isEdit ? (
        <AssessmentItemForm
          assessmentItem={item}
          handleCancel={() => setIsEdited(false)}
          claimRequestId={claimRequestId}
          claimRequestData={claimRequest}
        />
      ) : null}
    </Card>
  )
}

export default AssessmentItemCard
