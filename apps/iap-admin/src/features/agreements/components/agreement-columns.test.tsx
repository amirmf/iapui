import { agreementSchema } from '@iap/api-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAgreementStore } from '../context/store/agreement-store'
import { useAgreementColumns } from './agreement-columns'

const agreement = agreementSchema.parse({
  code: 'AG-100',
  extContractId: 100,
  id: '11111111-1111-4111-8111-111111111111',
  status: 'ACTIVE',
  title: 'قرارداد آزمایشی',
})

function AgreementActions() {
  const actionsColumn = useAgreementColumns().find(
    (column) => column.id === 'actions'
  )

  if (typeof actionsColumn?.cell !== 'function') {
    return null
  }

  return actionsColumn.cell({ row: { original: agreement } } as never)
}

describe('Agreement table actions', () => {
  beforeEach(async () => {
    await i18nReady
    useAgreementStore.setState({
      currentRow: null,
      openDialog: null,
      rowSelection: {},
    })
  })

  it('opens the edit dialog for the action row', async () => {
    const user = userEvent.setup()

    render(<AgreementActions />)

    await user.click(
      screen.getByRole('button', { name: i18n.t('agreements.actions.edit') })
    )

    expect(useAgreementStore.getState()).toMatchObject({
      currentRow: agreement,
      openDialog: 'edit',
    })
  })
})
