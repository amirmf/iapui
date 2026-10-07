import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSupportFlowStore } from './support-flow-store'

const myAnswer = vi.hoisted(() => vi.fn())
const publicAnswer = vi.hoisted(() => vi.fn())

vi.mock('../../services/support-service', () => ({
  supportService: { myAnswer, publicAnswer },
}))

describe('support flow initial questions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSupportFlowStore.setState(useSupportFlowStore.getInitialState(), true)
  })

  it('keeps the widget available after a follow-up response has no questions', async () => {
    myAnswer.mockResolvedValueOnce({
      nextSelectableQuestionKeys: [{ key: 'first-question' }],
    })

    await useSupportFlowStore.getState().resetFlow({
      errorMessage: 'error',
      context: { isMyIap: false, pageKey: 'claim-requests' },
    })

    expect(useSupportFlowStore.getState().hasInitialQuestions).toBe(true)

    myAnswer.mockResolvedValueOnce({})

    await useSupportFlowStore.getState().selectOption({
      errorMessage: 'error',
      option: {
        id: 'first-question',
        key: 'first-question',
        label: 'First question',
        source: 'selectable-question',
      },
    })

    expect(useSupportFlowStore.getState().hasInitialQuestions).toBe(true)
    expect(myAnswer).toHaveBeenNthCalledWith(1, {
      pageKey: 'claim-requests',
    })
    expect(myAnswer).toHaveBeenNthCalledWith(2, {
      optionsPage: 0,
      optionsSize: 10,
      pageKey: 'claim-requests',
      parametersContext: {},
      selectedQuestionKey: 'first-question',
      questionStack: undefined,
    })
  })

  it('uses myAnswer and preserves initial flow state in MyIAP context', async () => {
    myAnswer.mockResolvedValueOnce({
      nextSelectableQuestionKeys: [{ key: 'myiap-question' }],
    })

    await useSupportFlowStore.getState().resetFlow({
      errorMessage: 'error',
      context: { isMyIap: true, pageKey: 'myiap__claims' },
    })

    expect(useSupportFlowStore.getState()).toMatchObject({
      hasInitialQuestions: true,
      hasLoadedInitialResponse: true,
      isLoading: false,
      context: { isMyIap: true, pageKey: 'myiap__claims' },
    })
    expect(myAnswer).toHaveBeenCalledWith({ pageKey: 'myiap__claims' })
  })

  it('uses publicAnswer for a public authentication flow', async () => {
    publicAnswer.mockResolvedValueOnce({
      nextSelectableQuestionKeys: [{ key: 'login-question' }],
    })

    await useSupportFlowStore.getState().resetFlow({
      errorMessage: 'error',
      context: { isMyIap: false, isPublic: true, pageKey: 'login' },
    })

    expect(publicAnswer).toHaveBeenCalledWith({ pageKey: 'login' })
    expect(myAnswer).not.toHaveBeenCalled()
  })

  it('sets public context synchronously when support is opened', () => {
    useSupportFlowStore.getState().openSupport({
      isMyIap: false,
      isPublic: true,
      pageKey: 'login',
    })

    expect(useSupportFlowStore.getState()).toMatchObject({
      context: { isMyIap: false, isPublic: true, pageKey: 'login' },
      isOpen: true,
    })
  })

  it('opens a feature response and retains the page response for Back', async () => {
    myAnswer
      .mockResolvedValueOnce({ response: { message: 'Feature response' } })
      .mockResolvedValueOnce({
        nextSelectableQuestionKeys: [{ key: 'page-question' }],
      })

    useSupportFlowStore.setState({
      context: { isMyIap: false, pageKey: 'claim-requests' },
    })

    await useSupportFlowStore.getState().openFeatureSupport({
      featureKey: 'claim-status',
      errorMessage: 'error',
    })

    expect(myAnswer).toHaveBeenNthCalledWith(1, {
      pageKey: 'claim-requests',
      featureKeys: ['claim-status'],
    })
    expect(myAnswer).toHaveBeenNthCalledWith(2, {
      pageKey: 'claim-requests',
    })
    expect(useSupportFlowStore.getState().steps).toHaveLength(2)

    useSupportFlowStore.getState().goBack()

    expect(useSupportFlowStore.getState().steps).toHaveLength(1)
    expect(useSupportFlowStore.getState().steps[0]?.response).toEqual({
      nextSelectableQuestionKeys: [{ key: 'page-question' }],
    })
  })
})
