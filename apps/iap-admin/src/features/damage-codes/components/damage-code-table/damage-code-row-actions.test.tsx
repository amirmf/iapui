import { useDamageCodeStore } from '@features/damage-codes/model/store/damage-code-store'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { DamageCodeRowActions } from './damage-code-row-actions'

describe('DamageCodeRowActions', () => {
  beforeEach(async () => {
    await i18nReady
    useDamageCodeStore.getState().reset()
  })

  it('opens the reference pricing dialog for its row', async () => {
    const user = userEvent.setup()
    const damageCode = {
      code: 'D-1',
      id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'ACTIVE' as const,
      title: 'ویزیت',
    }

    render(<DamageCodeRowActions row={{ original: damageCode } as never} />)

    await user.click(
      screen.getByRole('button', {
        name: i18n.t('damageCodes.actions.managePricing'),
      })
    )

    expect(useDamageCodeStore.getState().currentRow).toEqual(damageCode)
    expect(useDamageCodeStore.getState().openDialog).toBe('pricing')
  })
})
