import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { AssessmentPromptViewDialog } from './assessment-prompt-view-dialog'

describe('AssessmentPromptViewDialog', () => {
  beforeEach(async () => {
    await i18nReady
    useAssessmentPrompt.getState().reset()
  })
  afterEach(cleanup)
  it('renders details with source status/place badges and closes on Escape', () => {
    useAssessmentPrompt.setState({
      open: 'view',
      currentRow: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Title',
        prompt: 'Prompt',
        docTypeCode: 'D-1',
        agreementId: '550e8400-e29b-41d4-a716-446655440001',
        status: 'ACTIVE',
        placeType: 'CLINIC',
        ruleState: 'SECONDARY',
      },
    })
    render(<AssessmentPromptViewDialog />)
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByText('Title')).toBeTruthy()
    expect(screen.getByText('D-1')).toBeTruthy()
    expect(
      screen.getByText(i18n.t('assessmentPrompts.status.active')).className
    ).toContain('dark:text-emerald-200')
    expect(
      screen.getByText(i18n.t('assessmentPrompts.placeType.clinic'))
    ).toBeTruthy()
    expect(
      screen.getByText(i18n.t('assessmentPrompts.ruleState.secondary'))
    ).toBeTruthy()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(useAssessmentPrompt.getState().open).toBe(null)
  })
  it('does not mount details without a selected prompt', () => {
    render(<AssessmentPromptViewDialog />)
    expect(screen.queryByRole('dialog')).toBe(null)
  })
})
