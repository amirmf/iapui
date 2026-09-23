import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetTitle,
  BottomSheetTrigger,
} from './bottom-sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet'

describe('overlays and disclosure', () => {
  it('names the dialog close control', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent closeLabel='Close panel'>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const closeButton = screen.getByRole('button', { name: 'Close panel' })

    expect(closeButton).toBeVisible()
    expect(closeButton).toHaveClass('left-3')
  })

  it.each([
    {
      Content: DialogContent,
      DialogRoot: Dialog,
      Title: DialogTitle,
      Trigger: DialogTrigger,
      role: 'dialog',
      triggerLabel: 'Open dialog',
    },
    {
      Content: AlertDialogContent,
      DialogRoot: AlertDialog,
      Title: AlertDialogTitle,
      Trigger: AlertDialogTrigger,
      role: 'alertdialog',
      triggerLabel: 'Open alert dialog',
    },
  ])(
    'animates $triggerLabel from the center of the viewport',
    async ({ Content, DialogRoot, role, Title, Trigger, triggerLabel }) => {
      const user = userEvent.setup()
      render(
        <DialogRoot>
          <Trigger>{triggerLabel}</Trigger>
          <Content>
            <Title>Title</Title>
          </Content>
        </DialogRoot>
      )

      await user.click(screen.getByRole('button', { name: triggerLabel }))

      const overlay = screen.getByRole(role)

      expect(overlay).toHaveClass('data-[state=open]:zoom-in-95')
      expect(overlay).toHaveClass('data-[state=closed]:zoom-out-95')
      expect(overlay).toHaveClass('data-[state=open]:duration-300')
      expect(overlay).toHaveClass('data-[state=closed]:duration-200')
      expect(overlay).toHaveClass('motion-reduce:animate-none')

      if (role === 'dialog') {
        expect(overlay).toHaveClass('top-1/2', 'left-1/2')
        expect(overlay).toHaveClass('-translate-x-1/2', '-translate-y-1/2')
      }
    }
  )

  it('updates collapsible expanded state', async () => {
    const user = userEvent.setup()
    render(
      <Collapsible>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>
    )

    await user.click(screen.getByRole('button', { name: 'Details' }))

    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('opens a bottom sheet from the bottom with an accessible close control', async () => {
    const user = userEvent.setup()
    render(
      <BottomSheet>
        <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
        <BottomSheetContent closeLabel='Close sheet'>
          <BottomSheetTitle>Sheet title</BottomSheetTitle>
        </BottomSheetContent>
      </BottomSheet>
    )

    await user.click(screen.getByRole('button', { name: 'Open sheet' }))

    expect(screen.getByRole('dialog')).toHaveClass('bottom-0')
    expect(screen.getByRole('dialog')).toHaveClass(
      'data-[state=open]:slide-in-from-bottom'
    )
    expect(screen.getByRole('dialog')).toHaveClass(
      'data-[state=closed]:slide-out-to-bottom',
      'data-[state=open]:duration-300',
      'data-[state=closed]:duration-200',
      'motion-reduce:animate-none'
    )
    expect(screen.getByRole('button', { name: 'Close sheet' })).toHaveClass(
      'left-3'
    )
  })

  it.each([
    {
      closedAnimation: 'data-[state=closed]:slide-out-to-left',
      openAnimation: 'data-[state=open]:slide-in-from-left',
      position: 'left-0',
      side: 'left' as const,
    },
    {
      closedAnimation: 'data-[state=closed]:slide-out-to-right',
      openAnimation: 'data-[state=open]:slide-in-from-right',
      position: 'right-0',
      side: 'right' as const,
    },
  ])(
    'opens a $side sheet with accessible directional motion',
    async ({ closedAnimation, openAnimation, position, side }) => {
      const user = userEvent.setup()
      render(
        <Sheet>
          <SheetTrigger>Open {side} sheet</SheetTrigger>
          <SheetContent closeLabel={`Close ${side} sheet`} side={side}>
            <SheetTitle>{side} sheet title</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      await user.click(
        screen.getByRole('button', { name: `Open ${side} sheet` })
      )

      const sheet = screen.getByRole('dialog')

      expect(sheet).toHaveClass(position, openAnimation, closedAnimation)
      expect(sheet).toHaveClass(
        'data-[state=open]:duration-300',
        'data-[state=closed]:duration-200',
        'motion-reduce:animate-none'
      )
      expect(
        screen.getByRole('button', { name: `Close ${side} sheet` })
      ).toHaveClass('left-3')
    }
  )
})
