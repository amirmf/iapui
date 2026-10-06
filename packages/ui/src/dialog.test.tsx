import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

describe('scoped source dialog presentation', () => {
  it('preserves default presentation for unrelated consumers', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Default dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toHaveClass(
      'p-5',
      'rounded-xl',
      'bg-surface-elevated'
    )
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('size-11')
  })

  it('applies verified reference shell, overlay, close, header and title classes only on opt-in', () => {
    render(
      <Dialog open>
        <DialogContent presentation='reference' className='sm:max-w-2xl'>
          <DialogHeader presentation='reference'>
            <DialogTitle presentation='reference'>Reference dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    const content = screen.getByRole('dialog')
    expect(content).toHaveClass(
      'p-6',
      'rounded-lg',
      'bg-dialog-background',
      'max-h-[95vh]',
      'overflow-auto',
      'sm:max-w-2xl'
    )
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass(
      'bg-black/50'
    )
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
      'top-4',
      'rtl:left-4',
      'ltr:right-4'
    )
    const title = screen.getByRole('heading', { name: 'Reference dialog' })
    expect(title).toHaveClass('leading-none', 'rtl:text-right')
    expect(title.parentElement).toHaveClass('text-center', 'sm:text-left')
  })
})

describe('reference dialog presentation', () => {
  it('keeps long forms scrollable and scopes source styles', () => {
    render(
      <Dialog open>
        <DialogContent presentation='reference' aria-describedby={undefined}>
          <DialogHeader data-testid='header'>
            <DialogTitle>Coverage</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toHaveClass(
      'max-h-[95vh]',
      'overflow-auto',
      'p-6',
      'rounded-lg'
    )
    expect(screen.getByTestId('header')).toHaveClass(
      'text-center',
      'sm:text-left'
    )
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
      'ltr:right-4',
      'rtl:left-4'
    )
  })
})
