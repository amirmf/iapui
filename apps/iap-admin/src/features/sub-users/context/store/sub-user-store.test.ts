import { beforeEach, describe, expect, it } from 'vitest'

import { useSubUserStore } from './sub-user-store'

describe('sub-user-store', () => {
  beforeEach(() => {
    useSubUserStore.getState().reset()
  })

  it('manages dialog open state and current row', () => {
    const mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: '0123456789',
    }

    useSubUserStore.getState().setCurrentRow(mockUser as never)
    useSubUserStore.getState().setOpen('editor')

    expect(useSubUserStore.getState().open).toBe('editor')
    expect(useSubUserStore.getState().currentRow).toEqual(mockUser)

    useSubUserStore.getState().reset()
    expect(useSubUserStore.getState().open).toBeNull()
    expect(useSubUserStore.getState().currentRow).toBeNull()
  })

  it('manages row selection and selected user accounts', () => {
    useSubUserStore.getState().setRowSelection({ '0': true })
    expect(useSubUserStore.getState().rowSelection).toEqual({ '0': true })

    const mockAccount = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: '0123456789',
    }
    useSubUserStore.getState().setSelectedUserAccount([mockAccount as never])
    expect(useSubUserStore.getState().selectedUserAccount).toHaveLength(1)
  })
})
