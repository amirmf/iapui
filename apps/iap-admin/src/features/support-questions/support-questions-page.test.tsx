import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SupportQuestionsPage } from './support-questions-page'

vi.mock('./context', () => ({
  SupportQuestionProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid='support-question-provider'>{children}</div>
  ),
}))

vi.mock('./components/support-questions/support-questions-section', () => ({
  SupportQuestionsSection: () => (
    <div data-testid='support-questions-section' />
  ),
}))

vi.mock('./components/support-pages/support-pages-section', () => ({
  SupportPagesSection: () => <div data-testid='support-pages-section' />,
}))

vi.mock('./components/support-features/support-features-section', () => ({
  SupportFeaturesSection: () => <div data-testid='support-features-section' />,
}))

describe('SupportQuestionsPage', () => {
  it('renders provider with questions section, pages section, and features section', () => {
    const { container } = render(<SupportQuestionsPage />)
    const provider = screen.getByTestId('support-question-provider')

    const questionsSec = screen.getByTestId('support-questions-section')
    const pagesSec = screen.getByTestId('support-pages-section')
    const featuresSec = screen.getByTestId('support-features-section')

    expect(provider.contains(questionsSec)).toBe(true)
    expect(provider.contains(pagesSec)).toBe(true)
    expect(provider.contains(featuresSec)).toBe(true)

    // Verify ordering
    const questionsIndex = container.innerHTML.indexOf(
      'data-testid="support-questions-section"'
    )
    const pagesIndex = container.innerHTML.indexOf(
      'data-testid="support-pages-section"'
    )
    const featuresIndex = container.innerHTML.indexOf(
      'data-testid="support-features-section"'
    )

    expect(questionsIndex).toBeLessThan(pagesIndex)
    expect(pagesIndex).toBeLessThan(featuresIndex)
  })
})
