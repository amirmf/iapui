import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { agreementPartyApplService } from '@features/agreements/services/agreement-party-appl-service'
import { ConfirmDialog, DeleteMethodDialog } from '@iap/dialogs'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { AgreementPartyApplDeleteMethodDialog } from './agreement-party-appl-delete-method-dialog'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

describe('Reference party delete flow', () => {
  beforeAll(async () => {
    await i18nReady
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    useAgreementPartyApplStore.getState().reset()
  })

  it('uses the feature mutation, reference success key and non-awaited invalidation', async () => {
    const id = '11111111-1111-4111-8111-111111111111'
    const remove = vi
      .spyOn(agreementPartyApplService, 'bulkDeletePartyApplication')
      .mockResolvedValue()
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidate = vi
      .spyOn(client, 'invalidateQueries')
      .mockImplementation(() => new Promise(() => {}))
    useAgreementPartyApplStore.setState({
      openDialog: 'deleteMethod',
      rowSelection: { 0: true },
    })
    render(
      <QueryClientProvider client={client}>
        <AgreementPartyApplDeleteMethodDialog applications={[{ id }]} />
      </QueryClientProvider>
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    await waitFor(() => expect(remove).toHaveBeenCalledWith([id]))
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(i18n.t('common.deleteSuccess'))
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['agreement-party-appls'],
    })
    await waitFor(() =>
      expect(useAgreementPartyApplStore.getState().openDialog).toBeNull()
    )
  })

  it('keeps confirmation open when its owning mutation rejects', async () => {
    const onOpenChange = vi.fn()
    render(
      <DeleteMethodDialog
        presentation='reference'
        entityName='agreement party application'
        open
        onOpenChange={onOpenChange}
        onDelete={async () => {
          throw new Error('reported mutation failure')
        }}
      />
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    await waitFor(() =>
      expect(
        screen
          .getByRole('button', { name: i18n.t('common.delete') })
          .hasAttribute('disabled')
      ).toBe(false)
    )
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('alertdialog')).toBeTruthy()
  })

  it('renders reference method width and primary soft confirmation', () => {
    render(
      <DeleteMethodDialog
        presentation='reference'
        entityName='agreement party application'
        open
        onOpenChange={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    expect(screen.getByRole('dialog').className).toContain('sm:max-w-md')
    const soft = screen.getByRole('button', {
      name: i18n.t('common.softDelete'),
    })
    expect(soft.parentElement?.className).toContain('grid-cols-2 gap-4')
    fireEvent.click(soft)
    const confirm = screen.getByRole('button', {
      name: i18n.t('common.softDelete'),
    })
    expect(confirm.className).toContain('bg-primary')
    expect(confirm.className).not.toContain('bg-destructive')
    expect(screen.queryByRole('button', { name: 'Clear date' })).toBeNull()
  })

  it('renders the source plain confirmation header without an invented status badge', () => {
    render(
      <ConfirmDialog
        presentation='reference'
        open
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        title='Source title'
        description='Source description'
      />
    )
    const title = screen.getByText('Source title')
    expect(title.parentElement?.className).toContain('text-left')
    expect(title.className).toContain('text-lg font-semibold')
    expect(screen.getByRole('alertdialog').className).toContain('p-6')
    expect(screen.getByRole('alertdialog').className).toContain('bg-background')
    expect(title.nextElementSibling?.className).toContain('text-sm')
    expect(title.nextElementSibling?.textContent).toBe('Source description')
    expect(screen.getByRole('alertdialog').querySelector('svg')).toBeNull()
  })
})
