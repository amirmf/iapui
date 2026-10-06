import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

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
