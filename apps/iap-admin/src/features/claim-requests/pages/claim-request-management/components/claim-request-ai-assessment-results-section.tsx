import { ClaimRequestAiAssessmentResultCard } from '@features/claim-requests/pages/claim-request-management/components/claim-request-ai-assessment-result-card'
import type { ClaimRequest } from '@iap/api-types'
import { Separator } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

interface ClaimRequestAiAssessmentResultsSectionProps {
  aiAssessmentResults?: ClaimRequest['aiAssessmentResults']
}

export function ClaimRequestAiAssessmentResultsSection(
  props: ClaimRequestAiAssessmentResultsSectionProps
) {
  const { aiAssessmentResults } = props
  const { t } = useTranslation()
  const results = aiAssessmentResults ?? []

  if (!results.length) {
    return null
  }

  return (
    <>
      <section
        aria-label={t('claimRequests.aiAssessmentResults.title')}
        className='mt-4'
      >
        <ul className='max-h-72 space-y-2 overflow-y-auto'>
          {results.map((result) => (
            <ClaimRequestAiAssessmentResultCard
              key={
                result.id ??
                `${result.assessmentItemId ?? 'unknown'}-${result.createdAt ?? 'unknown'}-${result.assessType ?? 'unknown'}-${result.resolutionType ?? 'unknown'}`
              }
              result={result}
            />
          ))}
        </ul>
      </section>
      <Separator className='my-4' />
    </>
  )
}
