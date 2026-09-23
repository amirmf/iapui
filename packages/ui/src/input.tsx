import { type ChangeEvent, type ComponentPropsWithRef } from 'react'

import { cn } from './lib/cn'

export type InputProps = ComponentPropsWithRef<'input'> & {
  numerical?: boolean
  numberWithComma?: boolean
}

function normalizeNumericValue(value: string) {
  const englishDigits = value.replace(/[\u06F0-\u06F9]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 0x06f0 + 48)
  )

  return englishDigits.replace(/\D/g, '')
}

function formatWithCommas(value: string | number) {
  if (value === '' || Number.isNaN(Number(value))) {
    return value
  }

  return Number(value).toLocaleString('en-US')
}

export function Input(props: InputProps) {
  const {
    className,
    inputMode,
    maxLength,
    numberWithComma = false,
    numerical = false,
    onChange,
    ref,
    type = 'text',
    value,
    ...rest
  } = props
  const isNumerical = numerical || numberWithComma
  const displayedValue =
    numberWithComma && value !== undefined && value !== null
      ? formatWithCommas(value.toString())
      : value

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNumerical) {
      event.target.value = normalizeNumericValue(event.target.value)
    }

    if (maxLength !== undefined && event.target.value.length > maxLength) {
      return
    }

    onChange?.(event)
  }

  return (
    <input
      ref={ref}
      className={cn(
        'border-input bg-surface text-foreground placeholder:text-muted-foreground/90 focus-visible:ring-ring focus-visible:ring-offset-background aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30 aria-[invalid=true]:focus-visible:ring-destructive flex min-h-11 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:ring-2',
        className
      )}
      data-slot='input'
      inputMode={isNumerical ? (inputMode ?? 'numeric') : inputMode}
      maxLength={maxLength}
      onChange={handleChange}
      type={isNumerical ? 'text' : type}
      value={displayedValue}
      {...rest}
    />
  )
}
