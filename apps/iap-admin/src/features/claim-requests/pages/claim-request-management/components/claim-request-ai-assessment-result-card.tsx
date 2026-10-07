import {
  AI_ASSESSMENT_RESULT_ASSESS_TYPE_BADGE_COLORS,
  AI_ASSESSMENT_RESULT_ASSESS_TYPE_TRANSLATION_KEYS,
  AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_BADGE_COLORS,
  AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_CARD_COLORS,
  AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_TRANSLATION_KEYS,
} from '@features/claim-requests/constants/claim-request-status'
import type { ClaimRequest } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

type AiAssessmentResult = NonNullable<
  ClaimRequest['aiAssessmentResults']
>[number]

export function ClaimRequestAiAssessmentResultCard(props: {
  result: AiAssessmentResult
}) {
  const { result } = props
  const { t } = useTranslation()

  const typeLabel = result.assessType
    ? t(AI_ASSESSMENT_RESULT_ASSESS_TYPE_TRANSLATION_KEYS[result.assessType])
    : t('common.noData')
  const resolutionType = result.resolutionType ?? 'NONE'
  const resolutionLabel =
    result.resolutionType && result.resolutionType !== 'NONE'
      ? t(
          AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_TRANSLATION_KEYS[
            result.resolutionType
          ]
        )
      : null

  return (
    <li
      className={cn(
        'rounded-lg border p-3',
        AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_CARD_COLORS[resolutionType]
      )}
    >
      <div className='flex flex-wrap items-start justify-between gap-2'>
        <div className='min-w-0 flex-1'>
          {result.title ? (
            <p className='text-sm font-medium text-foreground'>
              {result.title}
            </p>
          ) : null}
        </div>
        <div className='flex flex-wrap items-center justify-end gap-1'>
          {result.assessType ? (
            <Badge
              presentation='reference'
              className={
                AI_ASSESSMENT_RESULT_ASSESS_TYPE_BADGE_COLORS[result.assessType]
              }
              variant='outline'
            >
              {typeLabel}
            </Badge>
          ) : null}
          {resolutionLabel ? (
            <Badge
              presentation='reference'
              className={
                AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_BADGE_COLORS[
                  resolutionType
                ]
              }
              variant='outline'
            >
              {resolutionLabel}
            </Badge>
          ) : null}
        </div>
      </div>

      {!result.description ||
      result.repetitiveResponseDescription ||
      result.amountValue ||
      result.quantityValue ? (
        <p className='mt-2 whitespace-pre-wrap break-words text-xs font-medium text-foreground'>
          {result.description ?? <span>{result.description}</span>}
          {result.repetitiveResponseDescription ?? (
            <span>{result.repetitiveResponseDescription}</span>
          )}
          {result.amountValue != null ? (
            <>
              <span>{t('claimRequests.aiAssessmentResults.amount')}</span>
              <span>{result.amountValue.toLocaleString('en-US')}</span>
            </>
          ) : null}
          {result.quantityValue ? (
            <>
              <span>{t('claimRequests.aiAssessmentResults.quantity')}</span>
              <span>{result.quantityValue.toLocaleString('en-US')}</span>
            </>
          ) : null}
        </p>
      ) : null}
    </li>
  )
}
