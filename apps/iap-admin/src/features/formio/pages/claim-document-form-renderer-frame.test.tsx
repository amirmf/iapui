// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ClaimDocumentFormRendererFrame } from './claim-document-form-renderer-frame'

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  query: {
    data: undefined as
      | {
          documents?: Array<{
            dataJsonSchema?: unknown
            extractedData?: unknown
            id?: string
          }>
        }
      | undefined,
    isLoading: false,
  },
  useMutation: vi.fn(),
  useQuery: vi.fn(),
  useQueryClient: vi.fn(),
}))
vi.mock('@formio/react', () => ({
  Form: (props: {
    onChange: (state: { data: Record<string, unknown> }) => void
    submission: { data: Record<string, unknown> }
  }) => (
    <div data-testid='formio-form'>
      <span>{JSON.stringify(props.submission.data)}</span>
      <button
        onClick={() => props.onChange({ data: { approved: true } })}
        type='button'
      >
        change
      </button>
    </div>
  ),
}))
vi.mock('@iap/ui', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}))
vi.mock('@features/claim-requests', () => ({
  claimRequestService: { findById: vi.fn(), updateDocuments: vi.fn() },
}))
vi.mock('@tanstack/react-query', () => ({
  useMutation: mocks.useMutation,
  useQuery: mocks.useQuery,
  useQueryClient: mocks.useQueryClient,
}))
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ claimRequestId: 'claim-1', documentId: 'document-1' }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))
afterEach(() => {
  cleanup()
  mocks.mutate.mockReset()
  mocks.query.data = undefined
  mocks.query.isLoading = false
  mocks.useMutation.mockReset()
  mocks.useQuery.mockReset()
  mocks.useQueryClient.mockReset()
})
function renderFrame() {
  mocks.useMutation.mockReturnValue({ isPending: false, mutate: mocks.mutate })
  mocks.useQuery.mockReturnValue(mocks.query)
  mocks.useQueryClient.mockReturnValue({ invalidateQueries: vi.fn() })
  return render(<ClaimDocumentFormRendererFrame />)
}
describe('ClaimDocumentFormRendererFrame', () => {
  it('renders reference loading, missing-document, and missing-schema states', async () => {
    mocks.query.isLoading = true
    const loading = renderFrame()
    expect(screen.getByText('common.loading')).toBeTruthy()
    loading.unmount()
    mocks.query.isLoading = false
    mocks.query.data = { documents: [] }
    const missing = renderFrame()
    expect(
      screen.getByText('claimRequests.documents.missingDocument')
    ).toBeTruthy()
    missing.unmount()
    mocks.query.data = {
      documents: [{ dataJsonSchema: '{}', id: 'document-1' }],
    }
    renderFrame()
    expect(
      await screen.findByText(
        'claimRequests.documents.messages.missingSchemaTitle'
      )
    ).toBeTruthy()
  })
  it('saves the latest Form.io submission', async () => {
    mocks.query.data = {
      documents: [
        {
          dataJsonSchema: { components: [{}], display: 'form' },
          extractedData: '{"approved":false}',
          id: 'document-1',
        },
      ],
    }
    renderFrame()
    await screen.findByTestId('formio-form')
    fireEvent.click(screen.getByRole('button', { name: 'change' }))
    fireEvent.click(
      screen.getByRole('button', {
        name: 'claimRequests.documents.actions.save',
      })
    )
    expect(mocks.mutate).toHaveBeenCalledWith({ approved: true })
    expect(mocks.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['claimRequest', 'claim-1'] })
    )
  })
})
