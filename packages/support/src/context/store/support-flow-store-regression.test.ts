import type { SupportFlowResponse } from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSupportFlowStore } from './support-flow-store'

const myAnswer = vi.hoisted(() => vi.fn())
vi.mock('../../services/support-service', () => ({
  supportService: { myAnswer, publicAnswer: vi.fn() },
}))

function deferredResponse() {
  let resolve!: (response: SupportFlowResponse) => void
  let reject!: (error: Error) => void
  const promise = new Promise<SupportFlowResponse>((accept, decline) => {
    resolve = accept
    reject = decline
  })
  return { promise, resolve, reject }
}

const initialResponse: SupportFlowResponse = {
  questionStack: ['root', 'choose-ticket'],
  parametersContext: { retained: 'original' },
  response: {
    requiredParam: 'ticketId',
    options: {
      content: [{ id: 'first', title: 'First' }],
      number: 0,
      size: 5,
      last: false,
    },
  },
}

function seedFlow(response: SupportFlowResponse = initialResponse) {
  useSupportFlowStore.setState({
    context: { isMyIap: true, pageKey: 'tickets' },
    steps: [{ id: 'initial', response }],
    answers: { retained: 'answer' },
    hasLoadedInitialResponse: true,
  })
}

describe('support flow request and state regressions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSupportFlowStore.setState(useSupportFlowStore.getInitialState(), true)
  })

  it('ignores an old initial response after the page context resets', async () => {
    const old = deferredResponse()
    myAnswer
      .mockReturnValueOnce(old.promise)
      .mockResolvedValueOnce({ response: { message: 'New page' } })
    const oldReset = useSupportFlowStore.getState().resetFlow({
      errorMessage: 'old error',
      context: { isMyIap: false, pageKey: 'old-page' },
    })
    await useSupportFlowStore.getState().resetFlow({
      errorMessage: 'new error',
      context: { isMyIap: false, pageKey: 'new-page' },
    })
    old.resolve({ response: { message: 'Stale page' } })
    await oldReset
    expect(useSupportFlowStore.getState()).toMatchObject({
      context: { pageKey: 'new-page' },
      isLoading: false,
      error: null,
    })
    expect(
      useSupportFlowStore
        .getState()
        .steps.map((step) => step.response.response?.message)
    ).toEqual(['New page'])
  })

  it('rolls back a pending option selection on failure and keeps the existing response', async () => {
    seedFlow()
    const request = deferredResponse()
    myAnswer.mockReturnValueOnce(request.promise)
    const selecting = useSupportFlowStore.getState().selectOption({
      errorMessage: 'Selection failed',
      option: {
        id: 'first',
        key: 'first',
        label: 'First',
        source: 'response-option',
      },
    })
    expect(useSupportFlowStore.getState().steps[0]?.selected).toEqual({
      key: 'first',
      label: 'First',
      display: 'OPTION',
    })
    expect(myAnswer).toHaveBeenCalledWith({
      pageKey: 'tickets',
      questionStack: ['root', 'choose-ticket'],
      parametersContext: { retained: 'original', ticketId: 'first' },
      selectedQuestionKey: 'choose-ticket',
      optionsPage: 0,
      optionsSize: 10,
    })
    request.reject(new Error('network'))
    await selecting
    expect(useSupportFlowStore.getState()).toMatchObject({
      error: 'Selection failed',
      isLoading: false,
      answers: { retained: 'answer' },
    })
    expect(useSupportFlowStore.getState().steps).toEqual([
      { id: 'initial', response: initialResponse, selected: undefined },
    ])
  })

  it('restores answers and the selected message after failed text submission', async () => {
    seedFlow()
    const request = deferredResponse()
    myAnswer.mockReturnValueOnce(request.promise)
    const submitting = useSupportFlowStore
      .getState()
      .submitText({ value: '  my ticket  ', errorMessage: 'Text failed' })
    expect(useSupportFlowStore.getState().answers).toEqual({
      retained: 'answer',
      ticketId: '  my ticket  ',
    })
    expect(useSupportFlowStore.getState().steps[0]?.selected?.label).toBe(
      '  my ticket  '
    )
    expect(myAnswer).toHaveBeenCalledWith({
      pageKey: 'tickets',
      questionStack: ['root', 'choose-ticket'],
      parametersContext: { retained: 'original', ticketId: 'my ticket' },
      selectedQuestionKey: 'choose-ticket',
    })
    request.reject(new Error('network'))
    await submitting
    expect(useSupportFlowStore.getState()).toMatchObject({
      error: 'Text failed',
      isLoading: false,
      answers: { retained: 'answer' },
    })
    expect(useSupportFlowStore.getState().steps).toEqual([
      { id: 'initial', response: initialResponse, selected: undefined },
    ])
  })

  it('requests the next option page for the active question and appends its content', async () => {
    seedFlow()
    myAnswer.mockResolvedValueOnce({
      ...initialResponse,
      response: {
        requiredParam: 'ticketId',
        options: {
          content: [{ id: 'second', title: 'Second' }],
          number: 1,
          size: 5,
          last: true,
        },
      },
    })
    await useSupportFlowStore
      .getState()
      .loadMoreOptions({ errorMessage: 'Paging failed' })
    expect(myAnswer).toHaveBeenCalledWith({
      pageKey: 'tickets',
      questionStack: ['root', 'choose-ticket'],
      parametersContext: { retained: 'original' },
      selectedQuestionKey: 'choose-ticket',
      optionsPage: 1,
      optionsSize: 5,
    })
    expect(
      useSupportFlowStore.getState().steps[0]?.response.response?.options
    ).toEqual({
      content: [
        { id: 'first', title: 'First' },
        { id: 'second', title: 'Second' },
      ],
      number: 1,
      size: 5,
      last: true,
    })
    expect(useSupportFlowStore.getState().isLoadingMoreOptions).toBe(false)
    await useSupportFlowStore
      .getState()
      .loadMoreOptions({ errorMessage: 'Paging failed' })
    expect(myAnswer).toHaveBeenCalledTimes(1)
  })

  it('ignores a stale option response and its cleanup while a new context is loading', async () => {
    seedFlow()
    const old = deferredResponse()
    const current = deferredResponse()
    myAnswer
      .mockReturnValueOnce(old.promise)
      .mockReturnValueOnce(current.promise)
    const selecting = useSupportFlowStore.getState().selectOption({
      errorMessage: 'Old failed',
      option: {
        id: 'next',
        key: 'next',
        label: 'Next',
        source: 'selectable-question',
      },
    })
    const resetting = useSupportFlowStore.getState().resetFlow({
      errorMessage: 'Current failed',
      context: { isMyIap: false, pageKey: 'new-page' },
    })
    old.resolve({ response: { message: 'Stale selection' } })
    await selecting
    expect(useSupportFlowStore.getState()).toMatchObject({
      isLoading: true,
      context: { pageKey: 'new-page' },
      steps: [],
      error: null,
    })
    current.resolve({ response: { message: 'Current' } })
    await resetting
    expect(
      useSupportFlowStore.getState().steps[0]?.response.response?.message
    ).toBe('Current')
  })
})
