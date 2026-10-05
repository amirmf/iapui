import type { ComponentProps, ReactNode } from 'react'

import { useRepetitiveResponseStore } from '@features/repetitive-responses/context/store/repetitive-response-store'
import { i18nReady } from '@shared/i18n/i18n'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import RepetitiveResponsesSection from './repetitive-responses-section'

const response = {
  description: 'متن پاسخ',
  id: '550e8400-e29b-41d4-a716-446655440000',
  repetitiveResponseGroupId: '550e8400-e29b-41d4-a716-446655440001',
  seqNum: 1,
  title: 'پاسخ',
  usageCount: 2,
}
const { tableProps } = vi.hoisted(() => ({ tableProps: vi.fn() }))

vi.mock(
  '@features/repetitive-responses/services/repetitive-response-service',
  () => ({
    repetitiveResponseService: { getPageFull: vi.fn() },
  })
)
vi.mock('./repetitive-response-columns', () => ({
  useRepetitiveResponseColumns: () => [],
}))
vi.mock('./repetitive-response-data-table-toolbar', () => ({
  default: () => null,
}))
vi.mock('./repetitive-response-form-dialog', () => ({
  RepetitiveResponseFormDialog: () => null,
}))
vi.mock('./repetitive-response-view-dialog', () => ({
  RepetitiveResponseViewDialog: () => null,
}))
vi.mock('./repetitive-response-delete-method-dialog', () => ({
  RepetitiveResponseDeleteMethodDialog: ({ open }: { open: boolean }) => (
    <div data-open={String(open)} data-testid='delete-dialog' />
  ),
}))
vi.mock('@iap/auth', () => ({
  isSuperAdminRole: () => true,
  useAuthSession: () => ({ user: { roles: ['SUPER_ADMIN'] } }),
}))
vi.mock('@iap/ui', () => ({
  Button: (props: ComponentProps<'button'>) => <button {...props} />,
  Permission: ({ children }: { children: ReactNode }) => <>{children}</>,
  cn: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' '),
}))
vi.mock('@shared/tables', () => ({
  PaginatedDataTable: (props: {
    onRowSelectionChange: (value: { 0: boolean }) => void
  }) => {
    tableProps(props)
    return (
      <button
        onClick={() => props.onRowSelectionChange({ 0: true })}
        type='button'
      >
        انتخاب
      </button>
    )
  },
}))
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { content: [response], totalElements: 1, totalPages: 1 },
    isLoading: false,
    refetch: vi.fn(),
  }),
}))
vi.mock('@tanstack/react-router', () => ({
  useRouterState: ({ select }: { select: (state: unknown) => unknown }) =>
    select({ location: { search: {} } }),
}))

describe('RepetitiveResponsesSection', () => {
  beforeAll(async () => {
    await i18nReady
  })
  beforeEach(() => {
    tableProps.mockClear()
    useRepetitiveResponseStore.getState().reset()
  })

  it('uses source table controls and resolves the selected response before delete', () => {
    render(<RepetitiveResponsesSection />)
    expect(tableProps).toHaveBeenCalledWith(
      expect.objectContaining({
        manualFiltering: true,
        onSortingChange: expect.any(Function),
        sorting: [],
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'انتخاب' }))
    fireEvent.click(screen.getByRole('button', { name: 'حذف' }))

    expect(useRepetitiveResponseStore.getState()).toMatchObject({
      currentResponseRow: response,
      responseOpen: 'deleteMethod',
    })
    expect(screen.getByTestId('delete-dialog').getAttribute('data-open')).toBe(
      'true'
    )
  })
})
