import { personSpecialDiseaseSchema } from '@iap/api-types'
import { beforeEach, describe, expect, it } from 'vitest'

import { usePersonSpecialDiseaseStore } from './person-special-disease-store'

const row = personSpecialDiseaseSchema.parse({
  id: 'disease-1',
  nationalCode: '0012345678',
})

describe('usePersonSpecialDiseaseStore', () => {
  beforeEach(() => usePersonSpecialDiseaseStore.getState().reset())

  it('keeps dialog, selected row, and table selection as feature-local UI state', () => {
    const store = usePersonSpecialDiseaseStore.getState()
    store.setCurrentRow(row)
    store.setOpenDialog('edit')
    store.setRowSelection({ 0: true })

    expect(usePersonSpecialDiseaseStore.getState()).toMatchObject({
      currentRow: row,
      openDialog: 'edit',
      rowSelection: { 0: true },
    })
  })

  it('resets every transient UI value when the page is unmounted', () => {
    const store = usePersonSpecialDiseaseStore.getState()
    store.setCurrentRow(row)
    store.setOpenDialog('bulkDelete')
    store.setRowSelection({ 0: true })

    store.reset()

    expect(usePersonSpecialDiseaseStore.getState()).toMatchObject({
      currentRow: null,
      openDialog: null,
      rowSelection: {},
    })
  })
})
