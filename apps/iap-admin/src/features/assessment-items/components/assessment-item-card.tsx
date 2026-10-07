import AssessmentItemCardAdjustment from '@features/assessment-items/components/assessment-item-card-adjustment'
import AssessmentItemCardFanavarnCalc from '@features/assessment-items/components/assessment-item-card-fanavarn-calc'
import AssessmentItemCardRowData from '@features/assessment-items/components/assessment-item-card-row-data'
import type {
  AssessmentItem,
  ClaimRequest,
  DmgCase,
  SubInsuredPersonResponse,
} from '@iap/api-types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LongText,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

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
    adjustmentAccess,
    overrideInsuredPerson,
    fanavaranCalculationResult,
  } = props
  const { t } = useTranslation()
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
            <LongText presentation='reference' className='mt-1 text-sm'>
              {item.description}
            </LongText>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AssessmentItemCard
