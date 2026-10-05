import { useBranchStore } from '@features/branches/context/store/branch-store'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { BranchRowActions } from './branch-row-actions'

const branch = { id: 'branch-1', unitName: 'مرکز' }

describe('BranchRowActions', () => {
  beforeEach(async () => {
    await i18nReady
    useBranchStore.getState().reset()
  })

  it('exposes the reference edit and delete actions with accessible names', async () => {
    const user = userEvent.setup()

    render(<BranchRowActions row={{ original: branch } as never} />)

    await user.click(
      screen.getByRole('button', { name: i18n.t('branches.actions.edit') })
    )
    expect(useBranchStore.getState()).toMatchObject({
      currentRow: branch,
      openDialog: 'edit',
    })

    await user.click(
      screen.getByRole('button', { name: i18n.t('branches.actions.delete') })
    )
    expect(useBranchStore.getState()).toMatchObject({
      currentRow: branch,
      openDialog: 'delete',
    })
  })
})
