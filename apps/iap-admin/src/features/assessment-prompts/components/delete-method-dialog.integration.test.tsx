import { DeleteMethodDialog } from '@iap/dialogs'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('shared delete confirmation failure recovery', () => {
  beforeEach(async () => {
    await i18nReady
  })
  afterEach(cleanup)

  it('keeps confirmation open after rejection and allows a successful retry', async () => {
    const onDelete = vi
      .fn()
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValueOnce(undefined)
    const onOpenChange = vi.fn()
    render(
      <DeleteMethodDialog
        entityName='assessment prompt'
        onDelete={onDelete}
        onOpenChange={onOpenChange}
        open
        preselectedMethod='hard'
      />
    )
    const confirm = screen.getByRole('button', {
      name: i18n.t('common.delete'),
    })
    fireEvent.click(confirm)
    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect((confirm as HTMLButtonElement).disabled).toBe(false)
    )
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    fireEvent.click(confirm)
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    expect(onDelete).toHaveBeenCalledTimes(2)
    expect(onDelete).toHaveBeenCalledWith('hard', undefined)
  })

  it('matches reference method grid and confirmation title, footer and soft action appearance', async () => {
    render(
      <DeleteMethodDialog
        presentation='reference'
        entityName='assessment prompt'
        onDelete={vi.fn()}
        onOpenChange={vi.fn()}
        open
        resetDelay={300}
      />
    )
    const softMethod = screen.getByRole('button', {
      name: i18n.t('common.softDelete'),
    })
    expect(softMethod.parentElement?.className).toContain('grid-cols-2 gap-4')
    expect(screen.getByRole('dialog').className).toContain('sm:max-w-md')
    fireEvent.click(softMethod)
    const heading = screen.getByRole('heading', {
      name: i18n.t('common.softDelete'),
    })
    const confirmation = screen.getByRole('alertdialog')
    expect(confirmation.className).toContain('rounded-lg')
    expect(confirmation.className).toContain('bg-background')
    expect(confirmation.className).toContain('p-6')
    expect(confirmation.className).toContain('sm:max-w-lg')
    expect(confirmation.className).toContain('slide-in-from-top-[48%]')
    expect(
      document.querySelector('[data-slot="alert-dialog-overlay"]')?.className
    ).toContain('bg-black/50')
    expect(heading.className).toContain('text-lg font-semibold')
    expect(
      heading.querySelector('svg')?.classList.contains('tabler-icon-eye-off')
    ).toBe(true)
    expect(heading.querySelector('span')?.className).toContain(
      'text-destructive'
    )
    const back = screen.getByRole('button', { name: i18n.t('common.back') })
    expect(
      back.querySelector('svg')?.classList.contains('tabler-icon-arrow-right')
    ).toBe(true)
    expect(back.className).not.toContain('border-input')
    const confirm = screen.getByRole('button', {
      name: i18n.t('common.softDelete'),
    })
    expect(confirm.className).toContain('bg-primary')
    expect(confirmation.querySelector('input')?.className).toContain('pr-10')
    expect(confirmation.querySelector('input')?.className).not.toContain(
      'cursor-pointer'
    )
    expect(confirm.parentElement?.className).toBe(
      'flex flex-1 justify-end gap-2'
    )
    fireEvent.click(back)
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    expect(
      screen.getByRole('button', { name: i18n.t('common.delete') }).className
    ).toContain('bg-destructive')
    expect(
      screen.getByRole('heading', {
        name: i18n.t('common.dialog.deleteDialog.permanentTitle'),
      })
    ).toBeTruthy()
    expect(
      screen
        .getByRole('heading', {
          name: i18n.t('common.dialog.deleteDialog.permanentTitle'),
        })
        .querySelector('svg')
        ?.classList.contains('tabler-icon-trash')
    ).toBe(true)
  })
})
