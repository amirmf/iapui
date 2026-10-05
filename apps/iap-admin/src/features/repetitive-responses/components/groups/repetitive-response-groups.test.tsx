import { useRepetitiveResponseStore } from '@features/repetitive-responses/context/store/repetitive-response-store'
import { i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import RepetitiveResponseGroups from './repetitive-response-groups'

const { paginatedDataTable } = vi.hoisted(() => ({
  paginatedDataTable: vi.fn(() => <div data-testid='group-table' />),
}))

vi.mock(
  '@features/repetitive-responses/services/repetitive-response-group-service',
  () => ({
    repetitiveResponseGroupService: { getPage: vi.fn() },
  })
)
vi.mock('./repetitive-response-group-columns', () => ({
  useRepetitiveResponseGroupColumns: () => [],
}))
vi.mock('./repetitive-response-group-data-table-toolbar', () => ({
  default: () => null,
}))
vi.mock('./repetitive-response-group-delete-method-dialog', () => ({
  RepetitiveResponseGroupDeleteMethodDialog: () => null,
}))
vi.mock('./repetitive-response-group-form-dialog', () => ({
  RepetitiveResponseGroupFormDialog: () => null,
}))
vi.mock('./repetitive-response-group-view-dialog', () => ({
  RepetitiveResponseGroupViewDialog: () => null,
}))
vi.mock('@iap/auth', () => ({
  isSuperAdminRole: () => false,
  useAuthSession: () => ({ user: { roles: [] } }),
}))
vi.mock('@iap/ui', () => ({
  Button: (props: React.ComponentProps<'button'>) => <button {...props} />,
  Permission: ({
    children,
    hasPermission,
  }: {
    children: React.ReactNode
    hasPermission: boolean
  }) => (hasPermission ? children : null),
  cn: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' '),
}))
vi.mock('@shared/tables', () => ({
  PaginatedDataTable: paginatedDataTable,
}))
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { content: [], totalElements: 0, totalPages: 0 },
    isLoading: false,
    refetch: vi.fn(),
  }),
}))
vi.mock('@tanstack/react-router', () => ({
  useRouterState: () => ({}),
}))

describe('RepetitiveResponseGroups', () => {
  beforeAll(async () => {
    await i18nReady
  })

  beforeEach(() => {
    paginatedDataTable.mockClear()
    useRepetitiveResponseStore.getState().reset()
  })

  it('uses the reference server-table controls and hides bulk delete without super-admin access', () => {
    render(<RepetitiveResponseGroups />)

    expect(screen.queryByText('حذف')).toBeNull()
    expect(paginatedDataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        manualFiltering: true,
        onSortingChange: expect.any(Function),
        sorting: [],
      }),
      undefined
    )
  })
})
