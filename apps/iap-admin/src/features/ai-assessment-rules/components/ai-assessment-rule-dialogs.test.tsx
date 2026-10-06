import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAiAssessmentRuleStore } from '../context/store/ai-assessment-rule-store'
import { aiAssessmentRuleService } from '../services/ai-assessment-rule-service'
import { AiAssessmentRuleBulkDeleteDialog } from './ai-assessment-rule-bulk-delete-dialog'
import { AiAssessmentRuleDeleteDialog } from './ai-assessment-rule-delete-dialog'

vi.mock('../services/ai-assessment-rule-service', () => ({
  aiAssessmentRuleService: {
    bulkDelete: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
  },
}))

describe('AiAssessmentRule Dialogs', () => {
  let queryClient: QueryClient

  beforeEach(async () => {
    await i18nReady
    vi.clearAllMocks()
    useAiAssessmentRuleStore.getState().reset()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  afterEach(cleanup)

  it('renders and confirms single delete dialog', async () => {
    vi.mocked(aiAssessmentRuleService.delete).mockResolvedValue()

    useAiAssessmentRuleStore.getState().setCurrentRow({
      aiModel: 'KAVAN_TEXT_SMALL',
      definitionType: 'GENERAL',
      id: 'rule-del-1',
      ruleState: 'INFORMATION',
      status: 'ACTIVE',
    })
    useAiAssessmentRuleStore.getState().setOpen('delete')

    render(
      <QueryClientProvider client={queryClient}>
        <AiAssessmentRuleDeleteDialog />
      </QueryClientProvider>
    )

    expect(
      screen.getByText(i18n.t('aiAssessmentRules.delete.title'))
    ).toBeTruthy()

    const confirmButton = screen.getByRole('button', {
      name: i18n.t('common.delete'),
    })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(aiAssessmentRuleService.delete).toHaveBeenCalledWith('rule-del-1')
    })
  })

  it('renders and confirms bulk delete dialog', async () => {
    vi.mocked(aiAssessmentRuleService.bulkDelete).mockResolvedValue()

    useAiAssessmentRuleStore.getState().setOpen('bulkDelete')

    render(
      <QueryClientProvider client={queryClient}>
        <AiAssessmentRuleBulkDeleteDialog ids={['rule-1', 'rule-2']} />
      </QueryClientProvider>
    )

    expect(
      screen.getByText(i18n.t('aiAssessmentRules.bulkDelete.title'))
    ).toBeTruthy()

    const confirmButton = screen.getByRole('button', {
      name: i18n.t('common.delete'),
    })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(aiAssessmentRuleService.bulkDelete).toHaveBeenCalledWith([
        'rule-1',
        'rule-2',
      ])
    })
  })
})
