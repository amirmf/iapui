import AssessmentPromptProvider from '@features/assessment-prompts/context/provider/assessment-prompt-provider'
import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

describe('AssessmentPromptProvider reference lifecycle', () => {
  afterEach(() => {
    cleanup()
    useAssessmentPrompt.getState().reset()
  })

  it('clears row on close and resets all feature state on unmount', () => {
    const { unmount } = render(
      <AssessmentPromptProvider>
        <span>Child</span>
      </AssessmentPromptProvider>
    )
    const store = useAssessmentPrompt.getState()
    store.setCurrentRow({ title: 'Selected' })
    store.setOpen('edit')
    expect(useAssessmentPrompt.getState().currentRow).toEqual({
      title: 'Selected',
    })
    store.setOpen(null)
    expect(useAssessmentPrompt.getState().currentRow).toBeNull()
    store.setOpen('create')
    store.setRowSelection({ 0: true })
    unmount()
    expect(useAssessmentPrompt.getState()).toMatchObject({
      open: null,
      currentRow: null,
      rowSelection: {},
    })
  })
})
