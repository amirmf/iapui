// @vitest-environment jsdom
import type { PropsWithChildren } from 'react'

import { usePersonSpecialDiseaseStore } from '@features/person-special-diseases/model/store/person-special-disease-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PersonSpecialDiseaseDeleteDialog } from './person-special-disease-delete-dialog'

const mocks = vi.hoisted(() => ({ delete: vi.fn() }))

vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: ({
    onConfirm,
    open,
  }: {
    onConfirm: () => void
    open: boolean
  }) =>
    open ? (
      <button onClick={onConfirm} type='button'>
        confirm-delete
      </button>
    ) : null,
}))

vi.mock('@modules/person-special-diseases', () => ({
  personSpecialDiseaseService: { delete: mocks.delete },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

function QueryProvider(props: PropsWithChildren) {
  const { children } = props
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('PersonSpecialDiseaseDeleteDialog', () => {
  afterEach(cleanup)

  beforeEach(() => {
    mocks.delete.mockReset()
    usePersonSpecialDiseaseStore.getState().reset()
  })

  it('deletes the selected row, refreshes the table, then closes the dialog', async () => {
    const sequence: string[] = []
    mocks.delete.mockImplementation(async () => sequence.push('delete'))
    const refetch = vi.fn(async () => sequence.push('refetch'))
    usePersonSpecialDiseaseStore.getState().setCurrentRow({ id: 'disease-1' })
    usePersonSpecialDiseaseStore.getState().setOpenDialog('delete')

    render(
      <QueryProvider>
        <PersonSpecialDiseaseDeleteDialog refetch={refetch} />
      </QueryProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }))

    await waitFor(() => expect(sequence).toEqual(['delete', 'refetch']))
    expect(usePersonSpecialDiseaseStore.getState().openDialog).toBeNull()
  })

  it('does not issue a delete request without a selected row identifier', () => {
    usePersonSpecialDiseaseStore.getState().setOpenDialog('delete')

    render(
      <QueryProvider>
        <PersonSpecialDiseaseDeleteDialog />
      </QueryProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }))

    expect(mocks.delete).not.toHaveBeenCalled()
  })
})
