// @vitest-environment jsdom
import { AgentClaimRequestObjectionForm } from '@features/agent-claim-requests/pages/detail/components/agent-claim-request-objection-form'
import type { Attachment, ClaimRequest } from '@iap/api-types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  claim: { id: 'claim' } as Partial<ClaimRequest>,
  submit: vi.fn(),
  refetch: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))
const attachment: Attachment = {
  id: 'file',
  filename: 'file.pdf',
  fileType: 'pdf',
  fileSize: 10,
  uploadDate: '2026-01-01',
  minioObjectName: 'file',
  bucketName: 'claims',
}
vi.mock(
  '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id',
  () => ({ default: () => ({ data: state.claim, refetch: state.refetch }) })
)
vi.mock(
  '@features/agent-claim-requests/services/agent-claim-request-service',
  () => ({ agentClaimRequestService: { submitObjection: state.submit } })
)
vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))
vi.mock('sonner', () => ({
  toast: { success: state.success, error: state.error },
}))
vi.mock('@modules/files', () => ({
  FileUploader: (props: {
    onChange: (value: Attachment[]) => void
    onUploadingChange: (value: boolean) => void
  }) => (
    <>
      <button type='button' onClick={() => props.onChange([attachment])}>
        upload
      </button>
      <button type='button' onClick={() => props.onUploadingChange(true)}>
        start upload
      </button>
    </>
  ),
}))
function mount() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <AgentClaimRequestObjectionForm />
    </QueryClientProvider>
  )
  return client
}
beforeEach(() => {
  vi.clearAllMocks()
  state.claim = { id: 'claim' }
  state.refetch.mockResolvedValue({})
  state.submit.mockResolvedValue({ id: 'claim', status: 'IN_ASSESSMENT' })
})
afterEach(cleanup)
async function fill() {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: 'upload' }))
  await user.type(
    screen.getByLabelText('agent.claimRequests.detail.description'),
    '  explanation  '
  )
  return user
}
describe('AgentClaimRequestObjectionForm', () => {
  it('renders source validation errors through shared fields', async () => {
    mount()
    await userEvent.click(
      screen.getByRole('button', {
        name: 'agent.claimRequests.detail.submitForm',
      })
    )
    expect(
      await screen.findByText('myiap.claimRequest.messages.descriptionRequired')
    ).toBeTruthy()
    expect(
      screen.getByText('myiap.claimRequest.messages.attachmentsRequired')
    ).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
    const description = screen.getByLabelText(
      'agent.claimRequests.detail.description'
    )
    expect(description.className).toContain('bg-transparent')
    expect(description.className).toContain('focus-visible:ring-[3px]')
    expect(description.getAttribute('aria-invalid')).toBe('true')
    expect(state.submit).not.toHaveBeenCalled()
  })
  it('submits trimmed source payload and awaits invalidation then refetch before cache/reset/toast', async () => {
    const client = mount()
    const order: string[] = []
    vi.spyOn(client, 'invalidateQueries').mockImplementation(async () => {
      order.push('invalidate')
    })
    state.refetch.mockImplementation(async () => {
      order.push('refetch')
    })
    vi.spyOn(client, 'setQueryData').mockImplementation(() => {
      order.push('cache')
      return undefined
    })
    state.success.mockImplementation(() => {
      order.push('toast')
    })
    const user = await fill()
    await user.click(
      screen.getByRole('button', {
        name: 'agent.claimRequests.detail.submitForm',
      })
    )
    await waitFor(() => expect(state.success).toHaveBeenCalled())
    expect(state.submit).toHaveBeenCalledWith({
      claimRequestId: 'claim',
      description: 'explanation',
      attachments: [attachment],
      claimRequestStatus: 'IN_ASSESSMENT',
    })
    expect(order).toEqual(['invalidate', 'refetch', 'cache', 'toast'])
    expect(
      (
        screen.getByLabelText(
          'agent.claimRequests.detail.description'
        ) as HTMLTextAreaElement
      ).value
    ).toBe('')
  })
  it('retains inputs on transport rejection', async () => {
    state.submit.mockRejectedValue(new Error('server'))
    const client = mount()
    const user = await fill()
    await user.click(
      screen.getByRole('button', {
        name: 'agent.claimRequests.detail.submitForm',
      })
    )
    await waitFor(() => expect(state.submit).toHaveBeenCalled())
    expect(client.getMutationCache().getAll()[0]?.options.meta).toEqual({
      errorPresentation: 'reference',
    })
    await waitFor(() =>
      expect(
        (
          screen.getByRole('button', {
            name: 'agent.claimRequests.detail.submitForm',
          }) as HTMLButtonElement
        ).disabled
      ).toBe(false)
    )
    expect(
      (
        screen.getByLabelText(
          'agent.claimRequests.detail.description'
        ) as HTMLTextAreaElement
      ).value
    ).toBe('  explanation  ')
    expect(state.success).not.toHaveBeenCalled()
    expect(state.refetch).not.toHaveBeenCalled()
  })
  it('blocks submit during upload without disabling description or upload', async () => {
    mount()
    await userEvent.click(screen.getByRole('button', { name: 'start upload' }))
    expect(
      (
        screen.getByRole('button', {
          name: 'agent.claimRequests.detail.submitForm',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(
      (
        screen.getByLabelText(
          'agent.claimRequests.detail.description'
        ) as HTMLTextAreaElement
      ).disabled
    ).toBe(false)
    expect(
      (screen.getByRole('button', { name: 'upload' }) as HTMLButtonElement)
        .disabled
    ).toBe(false)
  })
  it('reports a missing ID without making a request', async () => {
    state.claim = {}
    mount()
    const user = await fill()
    await user.click(
      screen.getByRole('button', {
        name: 'agent.claimRequests.detail.submitForm',
      })
    )
    await waitFor(() =>
      expect(state.error).toHaveBeenCalledWith(
        'agent.claimRequests.messages.claimIdMissing'
      )
    )
    expect(state.submit).not.toHaveBeenCalled()
  })
})
