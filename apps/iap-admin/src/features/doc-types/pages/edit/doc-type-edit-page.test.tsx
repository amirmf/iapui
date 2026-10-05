// @vitest-environment jsdom
import type { PropsWithChildren } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DocTypeEditPage } from './doc-type-edit-page'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  query: {
    data: undefined as { id: string } | undefined,
    isError: false,
    isLoading: false,
  },
  useQuery: vi.fn(),
}))

vi.mock('@features/doc-types/pages/shared/doc-type-page-layout', () => ({
  DocTypePageLayout: ({
    children,
    description,
    title,
  }: PropsWithChildren<{ description: string; title: string }>) => (
    <section>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </section>
  ),
}))

vi.mock('@features/doc-types/components/doc-type-form/doc-type-form', () => ({
  DocTypeForm: (props: { docType: { id: string }; mode: string }) => (
    <div data-testid='document-type-form'>
      {`${props.mode}:${props.docType.id}`}
    </div>
  ),
}))

vi.mock('@iap/ui', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('@modules/doc-types', () => ({
  docTypeService: { getById: vi.fn() },
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQuery,
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mocks.navigate,
  useParams: () => ({ docTypeId: 'invoice' }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

afterEach(() => {
  mocks.navigate.mockReset()
  mocks.useQuery.mockReset()
  mocks.query.data = undefined
  mocks.query.isError = false
  mocks.query.isLoading = false
})

describe('DocTypeEditPage', () => {
  it('renders the reference-equivalent loading state', () => {
    mocks.query.isLoading = true
    mocks.useQuery.mockReturnValue(mocks.query)

    render(<DocTypeEditPage />)

    expect(screen.getByText('common.loading')).toBeTruthy()
  })

  it('renders the edit form with the fetched document type', () => {
    mocks.query.data = { id: 'invoice' }
    mocks.useQuery.mockReturnValue(mocks.query)

    render(<DocTypeEditPage />)

    expect(screen.getByTestId('document-type-form').textContent).toBe(
      'edit:invoice'
    )
    expect(mocks.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
        queryKey: ['doc-types', 'invoice'],
      })
    )
  })

  it('shows the recoverable error state and returns to the document-type list', () => {
    mocks.query.isError = true
    mocks.useQuery.mockReturnValue(mocks.query)

    render(<DocTypeEditPage />)
    fireEvent.click(screen.getByRole('button', { name: 'common.goBack' }))

    expect(screen.getByText('docTypes.messages.updateError')).toBeTruthy()
    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/doc-types/' })
  })
})
