import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DamageCodePricingDataTableToolbar } from './damage-code-pricing-data-table-toolbar'

describe('DamageCodePricingDataTableToolbar', () => {
  it('renders every reference pricing filter', async () => {
    await i18nReady

    render(
      <DamageCodePricingDataTableToolbar
        onValuesChange={() => undefined}
        values={{}}
      />
    )

    expect(
      screen.getByPlaceholderText(
        i18n.t('damageCodePricings.columns.damageCode')
      )
    ).toBeTruthy()
    expect(
      screen.getByPlaceholderText(
        i18n.t('damageCodePricings.columns.damageCodeTitle')
      )
    ).toBeTruthy()
    expect(
      screen.getByText(i18n.t('damageCodePricings.filters.thruDateFrom'))
    ).toBeTruthy()
    expect(
      screen.getByText(i18n.t('damageCodePricings.filters.thruDateTo'))
    ).toBeTruthy()
    expect(
      screen.getByText(i18n.t('damageCodePricings.columns.priceType'))
    ).toBeTruthy()
  })
})
