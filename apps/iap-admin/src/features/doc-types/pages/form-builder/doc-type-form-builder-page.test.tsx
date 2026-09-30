// @vitest-environment jsdom
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DocTypeFormBuilderPage } from './doc-type-form-builder-page'

const navigate = vi.hoisted(() => vi.fn())
const open = vi.hoisted(() => vi.fn())

vi.mock('@modules/doc-types', () => ({
  docTypeService: { getById: vi.fn() },
}))
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: { docType: 'Invoice' } }),
}))
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  useParams: () => ({ docTypeId: 'invoice' }),
}))

describe('DocTypeFormBuilderPage', () => {
  beforeEach(async () => {
    await i18nReady
    navigate.mockReset()
    open.mockReset()
    vi.stubGlobal('open', open)
  })

  it('matches the reference builder heading, iframe URL, and actions', async () => {
    const user = userEvent.setup()
    render(<DocTypeFormBuilderPage />)

    expect(
      screen.getByRole('heading', {
        name: i18n.t('docTypes.dialog.builderTitle'),
      })
    ).toBeTruthy()
    expect(screen.getByText('Invoice')).toBeTruthy()
    expect(
      screen
        .getByTitle(i18n.t('docTypes.dialog.builderTitle'))
        .getAttribute('src')
    ).toBe('/formio/doc-types/invoice/builder')

    await user.click(
      screen.getByRole('button', { name: i18n.t('common.back') })
    )
    expect(navigate).toHaveBeenCalledWith({ to: '/doc-types/' })

    await user.click(
      screen.getByRole('button', { name: i18n.t('common.openInNewTab') })
    )
    expect(open).toHaveBeenCalledWith(
      '/formio/doc-types/invoice/builder',
      '_blank',
      'noopener,noreferrer'
    )
  })
})
