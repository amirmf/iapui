'use client'

import { type ComponentPropsWithoutRef, useContext } from 'react'

import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'

import { cn } from './lib/cn'

export type InputOTPProps = ComponentPropsWithoutRef<typeof OTPInput> & {
  containerClassName?: string
}

export function InputOTP(props: InputOTPProps) {
  const { className, containerClassName, ...rest } = props

  return (
    <OTPInput
      className={cn('disabled:cursor-not-allowed', className)}
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName
      )}
      data-slot='input-otp'
      {...rest}
    />
  )
}

export function InputOTPGroup(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props

  return (
    <div
      className={cn('flex items-center', className)}
      data-slot='input-otp-group'
      {...rest}
    />
  )
}

export type InputOTPSlotProps = ComponentPropsWithoutRef<'div'> & {
  index: number
}

export function InputOTPSlot(props: InputOTPSlotProps) {
  const { className, index, ...rest } = props
  const context = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {}

  return (
    <div
      className={cn(
        'border-input dark:bg-input/30 data-[active=true]:border-ring data-[active=true]:ring-ring/50 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-sm transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
        className
      )}
      data-active={isActive}
      data-slot='input-otp-slot'
      {...rest}
    >
      {char}
      {hasFakeCaret ? (
        <span className='animate-caret-blink bg-foreground absolute h-4 w-px duration-1000' />
      ) : null}
    </div>
  )
}

export function InputOTPSeparator(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      data-slot='input-otp-separator'
      role='separator'
      {...rest}
    >
      <MinusIcon aria-hidden='true' />
    </div>
  )
}
