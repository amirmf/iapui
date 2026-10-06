import { beforeEach, describe, expect, it } from 'vitest'

import { useAiAssessmentRuleAutomationLevelsTableStore } from './ai-assessment-rule-automation-levels-table-store'
import { useAiAssessmentRuleDetailsTableStore } from './ai-assessment-rule-details-table-store'
import { useAiAssessmentRuleStore } from './ai-assessment-rule-store'

describe('ai-assessment-rule stores', () => {
  beforeEach(() => {
    useAiAssessmentRuleStore.getState().reset()
    useAiAssessmentRuleAutomationLevelsTableStore.getState().reset()
    useAiAssessmentRuleDetailsTableStore.getState().reset()
  })

  it('manages main store dialog state and row selection', () => {
    const store = useAiAssessmentRuleStore.getState()
    expect(store.open).toBeNull()
    expect(store.currentRow).toBeNull()

    store.setOpen('create')
    expect(useAiAssessmentRuleStore.getState().open).toBe('create')

    store.setCurrentRow({ id: 'rule-1', status: 'ACTIVE' })
    expect(useAiAssessmentRuleStore.getState().currentRow?.id).toBe('rule-1')

    store.setRowSelection({ '0': true })
    expect(useAiAssessmentRuleStore.getState().rowSelection).toEqual({
      '0': true,
    })

    store.setOpen(null)
    expect(useAiAssessmentRuleStore.getState().open).toBeNull()
    expect(useAiAssessmentRuleStore.getState().currentRow).toBeNull()

    store.reset()
    expect(useAiAssessmentRuleStore.getState().rowSelection).toEqual({})
  })

  it('manages automation levels sub-table store', () => {
    const store = useAiAssessmentRuleAutomationLevelsTableStore.getState()
    expect(store.open).toBeNull()

    store.setOpen('create')
    expect(useAiAssessmentRuleAutomationLevelsTableStore.getState().open).toBe(
      'create'
    )

    store.setCurrentAutomationLevel({
      automationLevel: 'HINT',
      maxThreshold: 80,
      minThreshold: 20,
    })
    expect(
      useAiAssessmentRuleAutomationLevelsTableStore.getState()
        .currentAutomationLevel?.automationLevel
    ).toBe('HINT')

    store.setOpen(null)
    expect(
      useAiAssessmentRuleAutomationLevelsTableStore.getState().open
    ).toBeNull()
    expect(
      useAiAssessmentRuleAutomationLevelsTableStore.getState()
        .currentAutomationLevel
    ).toBeNull()
  })

  it('manages details sub-table store', () => {
    const store = useAiAssessmentRuleDetailsTableStore.getState()
    expect(store.open).toBeNull()

    store.setOpen('edit')
    store.setCurrentDetail({ id: 'detail-1', methodNames: 'test' })
    expect(
      useAiAssessmentRuleDetailsTableStore.getState().currentDetail?.id
    ).toBe('detail-1')

    store.reset()
    expect(useAiAssessmentRuleDetailsTableStore.getState().open).toBeNull()
    expect(
      useAiAssessmentRuleDetailsTableStore.getState().currentDetail
    ).toBeNull()
  })
})
