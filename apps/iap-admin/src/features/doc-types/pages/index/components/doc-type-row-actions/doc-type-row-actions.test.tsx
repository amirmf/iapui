import { useDocTypeStore } from '@features/doc-types/model/doc-type-store'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DocTypeRowActions } from './doc-type-row-actions'

const navigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}))

describe('DocTypeRowActions', () => {
  beforeEach(async () => {
    await i18nReady
    navigate.mockReset()
    useDocTypeStore.getState().reset()
  })

  it('uses the reference accessible menu name and exposes all row actions', async () => {
    const user = userEvent.setup()

    render(
      <DocTypeRowActions
        row={
          {
            original: {
              docType: 'Invoice',
              id: 'invoice',
            },
          } as never
        }
      />
    )

    await user.click(
      screen.getByRole('button', { name: i18n.t('common.openMenu') })
    )

    for (const key of [
      'viewDetails',
      'buildForm',
      'sampleSubmission',
      'inlineEdit',
      'edit',
      'delete',
    ] as const) {
      expect(
        screen.getByRole('menuitem', {
          name: i18n.t(`docTypes.actions.${key}`),
        })
      ).toBeTruthy()
    }
  })
})
