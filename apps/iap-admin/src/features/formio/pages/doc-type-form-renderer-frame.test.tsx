// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import DocTypeFormRendererFrame from './doc-type-form-renderer-frame'

const mocks = vi.hoisted(() => ({
  invalidateQueries: vi.fn(),
  mutate: vi.fn(),
  query: {
    data: undefined as
      | {
          dataJsonSchema?: string | null
          dataSubmissionExample?: string | null
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
        change submission
      </button>
    </div>
  ),
}))

vi.mock('@iap/ui', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('@modules/doc-types', () => ({
  docTypeService: {
    getById: vi.fn(),
    updateSubmissionExample: vi.fn(),
  },
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: mocks.useMutation,
  useQuery: mocks.useQuery,
  useQueryClient: mocks.useQueryClient,
}))

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ docTypeId: 'invoice' }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

afterEach(() => {
  cleanup()
  mocks.invalidateQueries.mockReset()
  mocks.mutate.mockReset()
  mocks.query.data = undefined
  mocks.query.isLoading = false
  mocks.useMutation.mockReset()
  mocks.useQuery.mockReset()
  mocks.useQueryClient.mockReset()
})

function renderRenderer() {
  mocks.useMutation.mockReturnValue({
    isPending: false,
    mutate: mocks.mutate,
  })
  mocks.useQuery.mockReturnValue(mocks.query)
  mocks.useQueryClient.mockReturnValue({
    invalidateQueries: mocks.invalidateQueries,
  })

  return render(<DocTypeFormRendererFrame />)
}

describe('DocTypeFormRendererFrame', () => {
  it('matches the reference loading and missing-schema branches', async () => {
    mocks.query.isLoading = true
    const loading = renderRenderer()

    expect(screen.getByText('common.loading')).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'common.reset' })
        .hasAttribute('disabled')
    ).toBe(true)
    loading.unmount()

    mocks.query.isLoading = false
    mocks.query.data = { dataJsonSchema: '{}', dataSubmissionExample: '{}' }
    renderRenderer()

    expect(
      await screen.findByText('docTypes.dialog.missingSchemaTitle')
    ).toBeTruthy()
    expect(
      screen.getByText('docTypes.dialog.missingSchemaDescription')
    ).toBeTruthy()
  })

  it('saves the changed submission through the reference mutation payload', async () => {
    mocks.query.data = {
      dataJsonSchema: '{"display":"form","components":[{}]}',
      dataSubmissionExample: '{"approved":false}',
    }
    renderRenderer()

    await screen.findByTestId('formio-form')
    fireEvent.click(screen.getByRole('button', { name: 'change submission' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'docTypes.actions.saveSubmission' })
    )

    expect(mocks.mutate).toHaveBeenCalledWith({ approved: true })
    expect(mocks.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
        queryKey: ['doc-types', 'detail', 'invoice'],
      })
    )
  })
})
