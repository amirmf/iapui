import { describe, expect, it } from 'vitest'

import { useRepetitiveResponseStore } from './repetitive-response-store'

describe('useRepetitiveResponseStore', () => {
  it('clears rows and selections when its dialog workflows close', () => {
    useRepetitiveResponseStore.getState().setResponseOpen('edit')
    useRepetitiveResponseStore.getState().setGroupOpen('view')
    useRepetitiveResponseStore.getState().setGroupRowSelection({ 0: true })

    useRepetitiveResponseStore.getState().reset()

    expect(useRepetitiveResponseStore.getState()).toMatchObject({
      groupOpen: null,
      groupRowSelection: {},
      responseOpen: null,
    })
  })
})
