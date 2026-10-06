import { agreementSchema } from '@iap/api-types'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAgreementStore } from './agreement-store'

const agreement = agreementSchema.parse({
  extContractId: 100,
  id: '11111111-1111-4111-8111-111111111111',
  status: 'ACTIVE',
})

describe('useAgreementStore', () => {
  beforeEach(() => {
    useAgreementStore.setState({
      currentRow: null,
      openDialog: null,
      rowSelection: {},
    })
  })

  it('keeps only selected row indexes when a table-selection updater is applied', () => {
    const store = useAgreementStore.getState()
    store.setCurrentRow(agreement)
    store.setOpenDialog('deleteMethod')
    store.setRowSelection({ 0: true })
    store.setRowSelection((selection) => ({ ...selection, 1: false, 2: true }))

    expect(useAgreementStore.getState()).toMatchObject({
      currentRow: agreement,
      openDialog: 'deleteMethod',
      rowSelection: { 0: true, 1: false, 2: true },
    })
  })
})
