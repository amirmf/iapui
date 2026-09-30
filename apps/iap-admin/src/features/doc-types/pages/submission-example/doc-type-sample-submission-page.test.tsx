// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import DocTypeSampleSubmissionPage from './doc-type-sample-submission-page'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  query: { data: undefined as { docType?: string } | undefined },
  useQuery: vi.fn(),
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
  cleanup()
  mocks.navigate.mockReset()
  mocks.query.data = undefined
  mocks.useQuery.mockReset()
  vi.unstubAllGlobals()
})

describe('DocTypeSampleSubmissionPage', () => {
  it('matches the reference iframe source and fetches its document type', () => {
    mocks.query.data = { docType: 'Invoice' }
    mocks.useQuery.mockReturnValue(mocks.query)

    render(<DocTypeSampleSubmissionPage />)

    expect(screen.getByTitle('docTypes.dialog.submissionTitle')).toHaveProperty(
      'src',
      'http://localhost:3000/formio/doc-types/invoice/submission-example'
    )
    expect(screen.getByText('Invoice')).toBeTruthy()
    expect(mocks.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
        queryKey: ['doc-types', 'detail', 'invoice'],
      })
    )
  })

  it('navigates back and opens the embedded form in a protected new tab', () => {
    mocks.useQuery.mockReturnValue(mocks.query)
    const open = vi.fn()
    vi.stubGlobal('open', open)

    render(<DocTypeSampleSubmissionPage />)
    fireEvent.click(screen.getByRole('button', { name: 'common.back' }))
    fireEvent.click(screen.getByRole('button', { name: 'common.openInNewTab' }))

    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/doc-types/' })
    expect(open).toHaveBeenCalledWith(
      '/formio/doc-types/invoice/submission-example',
      '_blank',
      'noopener,noreferrer'
    )
  })
})
