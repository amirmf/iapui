import { useAssignementRuleStore } from '@features/assignement-rules/context/store/assignement-rule-store'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useAssignementRuleStore', () => {
  beforeEach(() => {
    useAssignementRuleStore.getState().reset()
  })

  it('initializes with default values', () => {
    const state = useAssignementRuleStore.getState()
    expect(state.currentRow).toBeNull()
    expect(state.openDialog).toBeNull()
    expect(state.rowSelection).toEqual({})
  })

  it('updates openDialog and currentRow', () => {
    const store = useAssignementRuleStore.getState()
    const mockRow = { id: 'rule-1', title: 'Test' }

    store.setCurrentRow(mockRow)
    store.setOpenDialog('edit')

    const updated = useAssignementRuleStore.getState()
    expect(updated.currentRow).toEqual(mockRow)
    expect(updated.openDialog).toBe('edit')
  })

  it('updates rowSelection using updater function or direct object', () => {
    const store = useAssignementRuleStore.getState()

    store.setRowSelection({ 0: true })
    expect(useAssignementRuleStore.getState().rowSelection).toEqual({ 0: true })

    store.setRowSelection((prev) => ({ ...prev, 1: true }))
    expect(useAssignementRuleStore.getState().rowSelection).toEqual({
      0: true,
      1: true,
    })
  })

  it('resets state', () => {
    const store = useAssignementRuleStore.getState()
    store.setOpenDialog('bulkDelete')
    store.setCurrentRow({ id: 'rule-1', title: 'Test' })
    store.setRowSelection({ 0: true })

    store.reset()
    const resetState = useAssignementRuleStore.getState()
    expect(resetState.currentRow).toBeNull()
    expect(resetState.openDialog).toBeNull()
    expect(resetState.rowSelection).toEqual({})
  })
})
