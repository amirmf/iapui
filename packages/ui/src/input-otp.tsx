'use client'

import { type ComponentPropsWithoutRef, useContext } from 'react'

import { OTPInput, OTPInputContext } from 'input-otp'

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
        'flex items-center gap-2 disabled:opacity-50',
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
  const slot = context.slots[index]
  const isActive = slot?.isActive ?? false

  return (
    <div
      className={cn(
        'border-input bg-surface text-foreground data-[active=true]:border-ring data-[active=true]:ring-ring/50 aria-[invalid=true]:border-destructive relative flex size-11 items-center justify-center rounded-lg border text-base transition-colors outline-none data-[active=true]:ring-2',
        className
      )}
      data-active={isActive}
      data-slot='input-otp-slot'
      {...rest}
    >
      {slot?.char}
      {slot?.hasFakeCaret ? (
        <span className='bg-foreground absolute h-5 w-px animate-pulse motion-reduce:animate-none' />
      ) : null}
    </div>
  )
}

export function InputOTPSeparator(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props

  return (
    <div
      className={cn(
        'text-muted-foreground flex items-center justify-center',
        className
      )}
      data-slot='input-otp-separator'
      role='separator'
      {...rest}
    >
      <span aria-hidden='true'>−</span>
    </div>
  )
}
