import { useRepetitiveResponseStore } from '@features/repetitive-responses/context/store/repetitive-response-store'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { RepetitiveResponseProvider } from './repetitive-response-provider'

describe('RepetitiveResponseProvider', () => {
  beforeEach(() => {
    useRepetitiveResponseStore.getState().reset()
  })

  it('resets feature-owned dialog and selection state on unmount', () => {
    const view = render(
      <RepetitiveResponseProvider>
        <div />
      </RepetitiveResponseProvider>
    )

    useRepetitiveResponseStore.getState().setResponseOpen('edit')
    useRepetitiveResponseStore.getState().setGroupOpen('view')
    useRepetitiveResponseStore.getState().setGroupRowSelection({ 0: true })
    view.unmount()

    expect(useRepetitiveResponseStore.getState()).toMatchObject({
      currentGroupRow: null,
      currentResponseRow: null,
      groupOpen: null,
      groupRowSelection: {},
      responseOpen: null,
    })
  })
})
