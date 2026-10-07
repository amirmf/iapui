import AssessmentItemCardRowData from '@features/assessment-items/components/assessment-item-card-row-data.tsx'
import { formatAssessmentAmount as formatAmount } from '@features/assessment-items/components/format-assessment-amount'
import {
  ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_COLORS,
  ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_TRANSLATION_KEYS,
} from '@features/assessment-items/constants/assessment-items-constant'
import { useAssessmentItem } from '@features/assessment-items/context/store/assessment-item-store'
import {
  type AssessmentItem,
  type ClaimRequestAdjustment,
} from '@iap/api-types'
import { Permission } from '@iap/ui'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Button } from '@iap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { IconTrash } from '@tabler/icons-react'

interface AssessmentItemCardAdjustmentProps {
  item: ClaimRequestAdjustment
  adjustmentAccess: boolean
  assessmentItem: AssessmentItem
}
function AssessmentItemCardAdjustment(
  props: AssessmentItemCardAdjustmentProps
) {
  const { item, adjustmentAccess, assessmentItem } = props
  const { t } = useTranslate()
  const { setOpen, setCurrentRow } = useAssessmentItem()

  const claimRequestAdjustmentStatus = item?.status || 'APPROVED'
  const claimRequestAdjustmentStatusColorClass = claimRequestAdjustmentStatus
    ? ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_COLORS[
        claimRequestAdjustmentStatus
      ]
    : ''
  const claimRequestAdjustmentStatusTranslationKey =
    claimRequestAdjustmentStatus
      ? ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_TRANSLATION_KEYS[
          claimRequestAdjustmentStatus
        ]
      : undefined

  return (
    <>
      <TooltipProvider>
        <div
          className={cn(
            'mt-3 flex items-center justify-between border-border text-sm',
            item.estimatedAmount && 'mb-2 border-b pb-2'
          )}
        >
          <div className='flex items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex items-center'>
                  <p className='font-medium text-yellow-600'>
                    {t('assessmentItems.adjustment.field.title')}
                    {item.title && item.title !== '-' ? item.title : null}
                  </p>
                  <p className='ms-0.5 line-clamp-1 text-xs font-medium text-muted-foreground'>
                    (<span>{item.damageCode?.code}: </span>
                    <span>{item.damageCode?.title}</span>)
                  </p>
                </div>
              </TooltipTrigger>
              {item.description && (
                <TooltipContent>{item.description}</TooltipContent>
              )}
            </Tooltip>
            {claimRequestAdjustmentStatus && (
              <Badge
                presentation='reference'
                variant='outline'
                className={cn(
                  'w-fit whitespace-nowrap capitalize',
                  claimRequestAdjustmentStatusColorClass
                )}
              >
                {claimRequestAdjustmentStatusTranslationKey
                  ? t(claimRequestAdjustmentStatusTranslationKey)
                  : claimRequestAdjustmentStatus.replace('_', ' ')}
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {item.totalSumAmount && !item.estimatedAmount && (
              <p className='font-medium tabular-nums'>
                {formatAmount(item.totalSumAmount)}
              </p>
            )}
            <Permission
              hasPermission={adjustmentAccess && item.status === 'SUBMITTED'}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    presentation='reference'
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-5 hover:bg-gray-200'
                    onClick={() => {
                      setCurrentRow(assessmentItem)
                      setOpen('adjustment-delete')
                    }}
                  >
                    <IconTrash className='h-4 w-4 text-destructive' />
                    <span className='sr-only'>
                      {t('assessmentItems.adjustment.delete.confirm')}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('assessmentItems.adjustment.delete.confirm')}
                </TooltipContent>
              </Tooltip>
            </Permission>
          </div>
        </div>
      </TooltipProvider>
      <AssessmentItemCardRowData
        amount={item.amount}
        estimatedAmount={item.estimatedAmount}
        franchizeDeductionAmount={item.franchizeDeductionAmount}
        quantity={item.quantity}
        remainCoverageAmount={item.remainCoverageAmount}
        toothNumber={item.toothNumber}
        toothNumbers={item.toothNumbers}
        className='rounded bg-yellow-100 p-2'
      />
    </>
  )
}

export default AssessmentItemCardAdjustment
