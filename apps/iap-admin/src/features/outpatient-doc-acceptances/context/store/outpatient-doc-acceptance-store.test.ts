import { describe, expect, it } from 'vitest'

import { useOutpatientDocAcceptanceStore } from './outpatient-doc-acceptance-store'

const row = { id: 'a1', extId: 12 }

describe('outpatient acceptance dialog store', () => {
  it('opens a dialog with the selected row and clears both on destructive close', () => {
    const store = useOutpatientDocAcceptanceStore.getState()
    store.reset()
    store.openDialog('delete', row)

    expect(useOutpatientDocAcceptanceStore.getState()).toMatchObject({
      open: 'delete',
      currentRow: row,
    })

    store.closeDialog({ clearRow: true })
    expect(useOutpatientDocAcceptanceStore.getState()).toMatchObject({
      open: null,
      currentRow: null,
    })
  })

  it('keeps the current row when switching dialog modes', () => {
    const store = useOutpatientDocAcceptanceStore.getState()
    store.openDialog('view', row)
    store.openDialog('manageClaim')

    expect(useOutpatientDocAcceptanceStore.getState()).toMatchObject({
      open: 'manageClaim',
      currentRow: row,
    })
  })
})
