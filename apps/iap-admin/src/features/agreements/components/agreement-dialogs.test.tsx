import { agreementSchema } from '@iap/api-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAgreementStore } from '../context/store/agreement-store'
import { AgreementViewDialog } from './agreement-view-dialog'

const agreement = agreementSchema.parse({
  code: 'AG-100',
  extContractId: 100,
  fromDate: '2026-10-05T10:00:00+03:30',
  id: '11111111-1111-4111-8111-111111111111',
  status: 'ACTIVE',
  title: 'قرارداد آزمایشی',
})

describe('AgreementViewDialog', () => {
  beforeEach(async () => {
    await i18nReady
    useAgreementStore.setState({
      currentRow: agreement,
      openDialog: 'view',
      rowSelection: {},
    })
  })

  it('shows the selected agreement details in a dialog', () => {
    render(<AgreementViewDialog />)

    expect(
      screen.getByRole('dialog', { name: i18n.t('agreements.dialog.details') })
    ).toBeTruthy()
    expect(screen.getByText(agreement.title!)).toBeTruthy()
    expect(screen.getByText(i18n.t('agreements.status.active'))).toBeTruthy()
  })
})
