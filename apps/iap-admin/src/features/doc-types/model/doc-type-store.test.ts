import { adminDocTypeSchema } from '@iap/api-types'
import { beforeEach, describe, expect, it } from 'vitest'

import { useDocTypeStore } from './doc-type-store'

const docType = adminDocTypeSchema.parse({
  id: 'doc-type-1',
  docType: 'Invoice',
})

describe('useDocTypeStore', () => {
  beforeEach(() => useDocTypeStore.getState().reset())

  it('keeps table UI state local and resets it explicitly', () => {
    const store = useDocTypeStore.getState()
    store.setCurrentRow(docType)
    store.setEditingRowId(docType.id ?? null)
    store.setOpenDialog('details')
    store.setRowSelection({ 0: true })

    expect(useDocTypeStore.getState()).toMatchObject({
      currentRow: docType,
      editingRowId: 'doc-type-1',
      openDialog: 'details',
      rowSelection: { 0: true },
    })

    useDocTypeStore.getState().reset()

    expect(useDocTypeStore.getState()).toMatchObject({
      currentRow: null,
      editingRowId: null,
      openDialog: null,
      rowSelection: {},
    })
  })
})
