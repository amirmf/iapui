// @vitest-environment jsdom
import { ClaimRequestAiAssessmentResultsSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-ai-assessment-results-section'
import ClaimRequestDoctorResponses from '@features/claim-requests/pages/claim-request-management/components/claim-request-doctor-responses'
import type { ClaimRequest } from '@iap/api-types'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key, i18n: { dir: () => 'rtl' } }),
}))
vi.mock('@shared/lib/format-date', () => ({
  formatDateTime: (value: string) => value,
}))
afterEach(cleanup)

describe('claim review source behavior', () => {
  it('filters doctor responses by role and blank text and uses assigned-by display name', () => {
    render(
      <ClaimRequestDoctorResponses
        assignmentHistory={[
          {
            role: 'DOCTOR_USER',
            description: '  response  ',
            assignedByDisplayName: 'doctor',
            assignedUserDisplayName: 'wrong',
          },
          { role: 'DOCTOR_USER', description: ' ' },
          { role: 'ROLE_DOCTOR_USER', description: 'filtered' },
        ]}
      />
    )
    expect(screen.getByText('doctor')).toBeTruthy()
    expect(screen.getByText('response')).toBeTruthy()
    expect(screen.queryByText('filtered')).toBeNull()
    expect(screen.queryByText('wrong')).toBeNull()
  })

  it('preserves source description-only suppression, zero and NONE resolution behavior', () => {
    const aiAssessmentResults = [
      {
        id: 'a',
        description: 'description alone',
        title: 'a',
        resolutionType: 'NONE',
      },
      { id: 'b', description: 'zero alone', amountValue: 0, title: 'b' },
      { id: 'c', description: 'positive', amountValue: 12, title: 'c' },
    ] as ClaimRequest['aiAssessmentResults']
    render(
      <ClaimRequestAiAssessmentResultsSection
        aiAssessmentResults={aiAssessmentResults}
      />
    )
    expect(screen.queryByText('description alone')).toBeNull()
    expect(screen.queryByText('zero alone')).toBeNull()
    expect(screen.getByText('positive')).toBeTruthy()
    expect(screen.getByText('12')).toBeTruthy()
    expect(screen.queryByText('NONE')).toBeNull()
  })
})
