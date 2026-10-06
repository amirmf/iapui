import type { AiAssessmentRule } from '@iap/api-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AiAssessmentRuleInspector } from './ai-assessment-rule-inspector'

vi.mock('./ai-assessment-rule-details-table', () => ({
  AiAssessmentRuleDetailsTable: () => (
    <div data-testid='rule-details-table'>Rule Details Table</div>
  ),
}))

vi.mock('./ai-assessment-rule-automation-levels-table', () => ({
  AiAssessmentRuleAutomationLevelsTable: () => (
    <div data-testid='automation-levels-table'>Automation Levels Table</div>
  ),
}))

describe('AiAssessmentRuleInspector', () => {
  beforeEach(async () => {
    await i18nReady
  })

  function renderInspector(rule?: AiAssessmentRule) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    return render(
      <QueryClientProvider client={queryClient}>
        <AiAssessmentRuleInspector onRefresh={vi.fn()} rule={rule} />
      </QueryClientProvider>
    )
  }

  it('renders placeholder message when no rule is selected', () => {
    renderInspector(undefined)
    expect(
      screen.getByText(i18n.t('aiAssessmentRules.inspector.empty'))
    ).toBeTruthy()
  })

  it('renders details table and automation levels table when rule is selected', () => {
    const mockRule: AiAssessmentRule = {
      aiModel: 'KAVAN_TEXT_SMALL',
      definitionType: 'GENERAL',
      id: 'rule-1',
      ruleState: 'INFORMATION',
      status: 'ACTIVE',
    }

    renderInspector(mockRule)
    expect(
      screen.getByText(i18n.t('aiAssessmentRules.inspector.ruleDetails'))
    ).toBeTruthy()
    expect(
      screen.getByText(i18n.t('aiAssessmentRules.fields.automationLevels'))
    ).toBeTruthy()
    expect(screen.getByTestId('rule-details-table')).toBeTruthy()
    expect(screen.getByTestId('automation-levels-table')).toBeTruthy()
  })
})
