// @vitest-environment jsdom
import { ClaimRequestDocuments } from '@features/claim-requests/pages/claim-request-management/components/claim-request-documents'
import { ClaimRequestDocumentsSection } from '@features/claim-requests/pages/claim-request-management/components/claim-request-documents-section'
import { documentSchema } from '@iap/api-types'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

const session = vi.hoisted(() => ({
  roles: ['ROLE_ADMIN_USER'],
  pathname: '/claim-requests/a/claim-request-management/',
}))
vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ user: { roles: session.roles } }),
  isAdminRole: (roles: string[]) =>
    roles.some((role) =>
      ['ROLE_ADMIN_USER', 'ROLE_SUPER_ADMIN', 'ROLE_SUPER_ADMIN_USER'].includes(
        role
      )
    ),
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: ({
    select,
  }: {
    select: (location: { pathname: string }) => boolean
  }) => select({ pathname: session.pathname }),
}))
vi.mock('@shared/i18n/i18n', () => ({
  useTranslate: () => ({
    t: (key: string, options?: { docType?: string }) =>
      options?.docType ? `${key}:${options.docType}` : key,
    i18n: { dir: () => 'rtl' },
  }),
}))

afterEach(() => {
  cleanup()
  session.roles = ['ROLE_ADMIN_USER']
  session.pathname = '/claim-requests/a/claim-request-management/'
})

describe('ClaimRequestDocuments', () => {
  it('shows the source empty state and missing-id state', () => {
    const { rerender } = render(
      <ClaimRequestDocuments claimRequestId='claim' documents={[]} />
    )
    expect(screen.getByText('claimRequests.documents.empty')).toBeTruthy()
    rerender(
      <ClaimRequestDocuments
        claimRequestId='claim'
        documents={[{ documentType: 'invoice' }]}
      />
    )
    expect(screen.getByText('claimRequests.documents.unavailable')).toBeTruthy()
  })

  it('encodes identifiers and falls back when the selected document is removed', async () => {
    const documents = [
      { id: 'first/id', documentType: 'first' },
      { id: 'second?id', documentType: 'second' },
    ]
    const { rerender } = render(
      <ClaimRequestDocuments claimRequestId='claim/id' documents={documents} />
    )
    expect(
      screen
        .getByTitle('claimRequests.documents.modalTitle:first')
        .getAttribute('src')
    ).toBe('/formio/claim-requests/claim%2Fid/documents/first%2Fid/')
    await userEvent.setup().click(screen.getByRole('tab', { name: 'second' }))
    expect(
      screen
        .getByTitle('claimRequests.documents.modalTitle:second')
        .getAttribute('src')
    ).toBe('/formio/claim-requests/claim%2Fid/documents/second%3Fid/')
    rerender(
      <ClaimRequestDocuments
        claimRequestId='claim/id'
        documents={[documents[0]]}
      />
    )
    expect(
      screen.getByRole('tab', { name: 'first' }).getAttribute('aria-selected')
    ).toBe('true')
  })

  it('limits document section to admin roles outside agent paths', () => {
    const { rerender } = render(
      <ClaimRequestDocumentsSection claimRequestId='claim' documents={[]} />
    )
    expect(screen.getByText('claimRequests.documents.title')).toBeTruthy()
    session.roles = ['ROLE_ASSESSMENT_USER']
    rerender(
      <ClaimRequestDocumentsSection claimRequestId='claim' documents={[]} />
    )
    expect(screen.queryByText('claimRequests.documents.title')).toBeNull()
    session.roles = ['ROLE_SUPER_ADMIN']
    session.pathname = '/agent/claim-requests/claim/claim-request-management/'
    rerender(
      <ClaimRequestDocumentsSection claimRequestId='claim' documents={[]} />
    )
    expect(screen.queryByText('claimRequests.documents.title')).toBeNull()
  })

  it('preserves the distinct editable document schema acceptance and stripping', () => {
    const parsed = documentSchema.parse({
      id: null,
      docType: 'invoice',
      extractedData: [1, null],
      dataJsonSchema: { components: [] },
      extra: 'discard',
    })
    expect(parsed).toEqual({
      id: null,
      docType: 'invoice',
      extractedData: [1, null],
      dataJsonSchema: { components: [] },
    })
    expect(documentSchema.safeParse({ id: 1 }).success).toBe(false)
    expect(documentSchema.safeParse({ extractionDate: 1 }).success).toBe(false)
  })
})
