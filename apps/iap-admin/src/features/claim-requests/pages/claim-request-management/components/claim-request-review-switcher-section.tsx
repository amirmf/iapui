import { useState } from 'react'

import { ClaimRequestAiAssessmentResultsSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-ai-assessment-results-section'
import { ClaimRequestDuplicatedSection } from '@features/claim-requests/pages/claim-request-management/components/duplicated/claim-request-duplicated-section'
import type { ClaimRequest } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { IconBrain, IconCopy } from '@tabler/icons-react'

type ReviewSection = 'ai-assessment-results' | 'duplicates'

interface ClaimRequestReviewSwitcherSectionProps {
  claimRequest: ClaimRequest
}

export function ClaimRequestReviewSwitcherSection(
  props: ClaimRequestReviewSwitcherSectionProps
) {
  const { claimRequest } = props
  const { i18n, t } = useTranslation()
  const hasAiAssessmentResults = Boolean(
    claimRequest.aiAssessmentResults?.length
  )
  const hasDuplicates = Boolean(claimRequest.duplicates?.length)
  const [selectedSection, setSelectedSection] = useState<ReviewSection>(() =>
    hasDuplicates ? 'duplicates' : 'ai-assessment-results'
  )

  if (!hasAiAssessmentResults && !hasDuplicates) {
    return null
  }

  const activeSection =
    selectedSection === 'duplicates' && !hasDuplicates
      ? 'ai-assessment-results'
      : selectedSection === 'ai-assessment-results' && !hasAiAssessmentResults
        ? 'duplicates'
        : selectedSection

  return (
    <section className='mt-4'>
      <div className='flex gap-2' dir={i18n.dir()}>
        {hasDuplicates ? (
          <Button
            presentation='reference'
            aria-pressed={activeSection === 'duplicates'}
            className={cn(
              'min-h-11 flex-1 whitespace-normal px-3 py-2 text-center font-semibold transition-colors',
              activeSection === 'duplicates'
                ? 'bg-destructive text-white hover:bg-destructive/90 hover:text-white'
                : 'bg-muted text-muted-foreground hover:bg-destructive/15 hover:text-destructive'
            )}
            onClick={() => setSelectedSection('duplicates')}
            type='button'
            variant='ghost'
          >
            <IconCopy aria-hidden='true' className='size-5' />
            {t('claimRequests.duplicateDetails.title')}
          </Button>
        ) : null}
        {hasAiAssessmentResults ? (
          <Button
            presentation='reference'
            aria-pressed={activeSection === 'ai-assessment-results'}
            className={cn(
              'min-h-11 flex-1 whitespace-normal px-3 py-2 text-center font-semibold transition-colors',
              activeSection === 'ai-assessment-results'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-primary/15 hover:text-primary'
            )}
            onClick={() => setSelectedSection('ai-assessment-results')}
            type='button'
            variant='ghost'
          >
            <IconBrain aria-hidden='true' className='size-5' />
          </Button>
        ) : null}
      </div>

      {activeSection === 'duplicates' ? (
        <ClaimRequestDuplicatedSection claimRequest={claimRequest} />
      ) : (
        <ClaimRequestAiAssessmentResultsSection
          aiAssessmentResults={claimRequest.aiAssessmentResults}
        />
      )}
    </section>
  )
}
