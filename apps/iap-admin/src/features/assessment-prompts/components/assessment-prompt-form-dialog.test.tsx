import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { agreementSelectionService } from '@features/assessment-prompts/services/agreement-selection-service'
import { assessmentPromptService } from '@features/assessment-prompts/services/assessment-prompt-service'
import { docTypeService } from '@modules/doc-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssessmentPromptFormDialog } from './assessment-prompt-form-dialog'

vi.mock(
  '@features/assessment-prompts/services/agreement-selection-service',
  () => ({
    agreementSelectionService: { getById: vi.fn(), getPage: vi.fn() },
  })
)
vi.mock(
  '@features/assessment-prompts/services/assessment-prompt-service',
  () => ({
    assessmentPromptService: { create: vi.fn(), update: vi.fn() },
  })
)
vi.mock('@modules/doc-types/services/doc-type-service', () => ({
  docTypeService: { getPage: vi.fn() },
}))

const id = '550e8400-e29b-41d4-a716-446655440000'
const agreementId = '550e8400-e29b-41d4-a716-446655440001'
const t = (key: string) => i18n.t(key as never)

function renderDialog() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const invalidate = vi.spyOn(client, 'invalidateQueries')
  render(
    <QueryClientProvider client={client}>
      <AssessmentPromptFormDialog />
    </QueryClientProvider>
  )
  return { client, invalidate }
}

async function fillRequired() {
  const user = userEvent.setup()
  await user.type(
    screen.getByLabelText(t('assessmentPrompts.dialog.fields.title')),
    'Prompt title'
  )
  await user.type(
    screen.getByLabelText(t('assessmentPrompts.dialog.fields.prompt')),
    'Prompt body'
  )
  return user
}

describe('AssessmentPromptFormDialog', () => {
  beforeEach(async () => {
    await i18nReady
    vi.clearAllMocks()
    localStorage.clear()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
    HTMLElement.prototype.scrollIntoView = vi.fn()
    vi.mocked(agreementSelectionService.getPage).mockResolvedValue({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 20,
      number: 0,
      first: true,
      last: true,
      numberOfElements: 0,
      empty: true,
    })
    vi.mocked(agreementSelectionService.getById).mockResolvedValue({
      id: agreementId,
      title: 'Selected agreement',
    })
    vi.mocked(docTypeService.getPage).mockResolvedValue({
      content: [{ docType: 'Document type', docTypeCode: 'DOC' }],
    })
    vi.mocked(assessmentPromptService.create).mockResolvedValue({ id })
    vi.mocked(assessmentPromptService.update).mockResolvedValue({ id })
    useAssessmentPrompt.getState().reset()
  })
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('matches source agreement prefetch while keeping doc-types disabled when closed', () => {
    renderDialog()
    expect(agreementSelectionService.getPage).toHaveBeenCalledWith({
      title: '',
    })
    expect(docTypeService.getPage).not.toHaveBeenCalled()
  })

  it('renders exact source required errors and prevents invalid submission', async () => {
    useAssessmentPrompt.getState().setOpen('create')
    renderDialog()
    fireEvent.click(screen.getByRole('button', { name: t('common.create') }))
    expect(await screen.findByText('Title is required')).toBeTruthy()
    expect(screen.getByText('Prompt is required')).toBeTruthy()
    expect(
      screen
        .getByLabelText(t('assessmentPrompts.dialog.fields.title'))
        .getAttribute('aria-invalid')
    ).toBe('true')
    expect(assessmentPromptService.create).not.toHaveBeenCalled()
  })

  it('submits create defaults and invalidates only after success', async () => {
    useAssessmentPrompt.getState().setOpen('create')
    const started = Date.now()
    const { invalidate } = renderDialog()
    expect(
      screen
        .getByLabelText(t('assessmentPrompts.dialog.fields.methodNames'))
        .getAttribute('dir')
    ).toBe('ltr')
    expect(
      screen
        .getByLabelText(t('assessmentPrompts.dialog.fields.inputParams'))
        .getAttribute('dir')
    ).toBe('ltr')
    const user = await fillRequired()
    await user.click(screen.getByRole('button', { name: t('common.create') }))
    await waitFor(() =>
      expect(assessmentPromptService.create).toHaveBeenCalledOnce()
    )
    const values = vi.mocked(assessmentPromptService.create).mock.calls[0]![0]
    expect(values).toMatchObject({
      title: 'Prompt title',
      prompt: 'Prompt body',
      status: 'ACTIVE',
      ruleState: 'SECONDARY',
      placeType: null,
      inputParams: '',
      methodNames: '',
      docTypeCode: '',
    })
    expect(values.fromDate.getTime()).toBeGreaterThanOrEqual(started)
    expect(values.thruDate).toBeUndefined()
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['assessment-prompts'],
      })
    )
    expect(useAssessmentPrompt.getState().open).toBeNull()
  })

  it('preserves edit values, dates, and the agreement outside search results', async () => {
    useAssessmentPrompt.getState().setCurrentRow({
      id,
      title: 'Existing',
      prompt: 'Body',
      agreementId,
      status: 'SUSPENDED',
      ruleState: 'DISPLAY',
      placeType: 'CLINIC',
      docTypeCode: 'DOC',
      fromDate: '2026-01-01T00:00:00.000Z',
      thruDate: '2026-12-31T00:00:00.000Z',
    })
    useAssessmentPrompt.getState().setOpen('edit')
    renderDialog()
    expect(await screen.findByText('Selected agreement')).toBeTruthy()
    expect(await screen.findByText('Document type')).toBeTruthy()
    const user = userEvent.setup()
    await user.click(
      screen.getByLabelText(t('assessmentPrompts.dialog.fields.agreement'))
    )
    expect(
      await screen.findByRole('option', { name: 'Selected agreement' })
    ).toBeTruthy()
    await user.click(screen.getByRole('option', { name: 'Selected agreement' }))
    await user.click(
      screen.getByRole('button', { name: t('common.saveChanges') })
    )
    await waitFor(() =>
      expect(assessmentPromptService.update).toHaveBeenCalledOnce()
    )
    expect(assessmentPromptService.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        agreementId,
        title: 'Existing',
        status: 'SUSPENDED',
        ruleState: 'DISPLAY',
        placeType: 'CLINIC',
        docTypeCode: 'DOC',
        fromDate: new Date('2026-01-01'),
        thruDate: new Date('2026-12-31'),
      })
    )
    expect(assessmentPromptService.create).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(useAssessmentPrompt.getState().currentRow).toBeNull()
    )
  })

  it('maps enum options to strings and the none option back to null', async () => {
    useAssessmentPrompt.getState().setOpen('create')
    renderDialog()
    const user = await fillRequired()
    const choose = async (field: string, label: string) => {
      await user.click(
        screen.getByLabelText(t(`assessmentPrompts.dialog.fields.${field}`))
      )
      await user.click(await screen.findByRole('option', { name: label }))
    }
    await choose('status', t('assessmentPrompts.status.inactive'))
    await choose('ruleState', t('assessmentPrompts.ruleState.preliminary'))
    await choose('placeType', t('assessmentPrompts.placeType.hospital'))
    await choose('placeType', t('common.none'))
    await choose('docType', 'Document type')
    await user.click(screen.getByRole('button', { name: t('common.create') }))
    await waitFor(() =>
      expect(assessmentPromptService.create).toHaveBeenCalledOnce()
    )
    expect(assessmentPromptService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        placeType: null,
        status: 'INACTIVE',
        ruleState: 'PRELIMINARY',
        docTypeCode: 'DOC',
      })
    )
  })

  it('keeps submitted values and prevents closing or resubmission while pending', async () => {
    let resolveSave!: (value: { id: string }) => void
    vi.mocked(assessmentPromptService.create).mockReturnValue(
      new Promise((resolve) => {
        resolveSave = resolve
      })
    )
    useAssessmentPrompt.getState().setOpen('create')
    const { invalidate } = renderDialog()
    const user = await fillRequired()
    const submit = screen.getByRole('button', {
      name: t('common.create'),
    }) as HTMLButtonElement
    await user.click(submit)
    await waitFor(() => expect(submit.disabled).toBe(true))
    expect(
      (
        screen.getByLabelText(
          t('assessmentPrompts.dialog.fields.title')
        ) as HTMLInputElement
      ).disabled
    ).toBe(false)
    await user.click(screen.getByRole('button', { name: t('common.cancel') }))
    await user.click(submit)
    expect(useAssessmentPrompt.getState().open).toBe('create')
    expect(assessmentPromptService.create).toHaveBeenCalledOnce()
    expect(invalidate).not.toHaveBeenCalled()
    resolveSave({ id })
    await waitFor(() => expect(useAssessmentPrompt.getState().open).toBeNull())
  })

  it('retains form values and does not invalidate when the API rejects a save', async () => {
    vi.mocked(assessmentPromptService.create).mockRejectedValue(
      new Error('Save rejected')
    )
    useAssessmentPrompt.getState().setOpen('create')
    const { invalidate } = renderDialog()
    const user = await fillRequired()
    const submit = screen.getByRole('button', {
      name: t('common.create'),
    }) as HTMLButtonElement
    await user.click(submit)
    await waitFor(() =>
      expect(assessmentPromptService.create).toHaveBeenCalledOnce()
    )
    await waitFor(() => expect(submit.disabled).toBe(false))
    expect(useAssessmentPrompt.getState().open).toBe('create')
    expect(
      (
        screen.getByLabelText(
          t('assessmentPrompts.dialog.fields.title')
        ) as HTMLInputElement
      ).value
    ).toBe('Prompt title')
    expect(invalidate).not.toHaveBeenCalled()
  })

  it('searches agreements immediately with source raw input and matching search placeholder', async () => {
    useAssessmentPrompt.getState().setOpen('create')
    renderDialog()
    const user = userEvent.setup()
    await waitFor(() =>
      expect(agreementSelectionService.getPage).toHaveBeenCalledWith({
        title: '',
      })
    )
    await user.click(
      screen.getByLabelText(t('assessmentPrompts.dialog.fields.agreement'))
    )
    const input = screen.getByPlaceholderText(
      t('assessmentPrompts.dialog.fields.selectAgreement')
    )
    fireEvent.change(input, { target: { value: ' raw search ' } })
    await waitFor(() =>
      expect(agreementSelectionService.getPage).toHaveBeenCalledWith({
        title: ' raw search ',
      })
    )
    expect(await screen.findByText(t('common.noResults'))).toBeTruthy()
  })

  it('uses source header/scroll geometry without invented required or date-clear controls', () => {
    useAssessmentPrompt.getState().setOpen('create')
    renderDialog()
    expect(
      screen.getByRole('heading').parentElement?.classList.contains('text-left')
    ).toBe(true)
    expect(
      screen
        .getByLabelText(t('assessmentPrompts.dialog.fields.title'))
        .hasAttribute('required')
    ).toBe(false)
    expect(
      screen
        .getByLabelText(t('assessmentPrompts.dialog.fields.prompt'))
        .hasAttribute('required')
    ).toBe(false)
    expect(
      screen
        .getByLabelText(t('assessmentPrompts.dialog.fields.prompt'))
        .classList.contains('bg-transparent')
    ).toBe(true)
    expect(
      screen
        .getByLabelText(t('assessmentPrompts.dialog.fields.methodNames'))
        .classList.contains('focus-visible:ring-[3px]')
    ).toBe(true)
    expect(screen.queryByRole('button', { name: 'Clear date' })).toBeNull()
  })

  it('clears doc type to source undefined rather than an invented empty value', async () => {
    useAssessmentPrompt.getState().setOpen('create')
    renderDialog()
    const user = await fillRequired()
    await user.click(
      screen.getByLabelText(t('assessmentPrompts.dialog.fields.docType'))
    )
    await user.click(
      await screen.findByRole('option', { name: 'Document type' })
    )
    await user.click(
      screen.getByLabelText(t('assessmentPrompts.dialog.fields.docType'))
    )
    await user.click(screen.getByRole('option', { name: t('common.clear') }))
    await user.click(screen.getByRole('button', { name: t('common.create') }))
    await waitFor(() =>
      expect(assessmentPromptService.create).toHaveBeenCalledOnce()
    )
    expect(
      vi.mocked(assessmentPromptService.create).mock.calls[0]![0].docTypeCode
    ).toBeUndefined()
  })
})
