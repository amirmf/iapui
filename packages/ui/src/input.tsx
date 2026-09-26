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
        'border-input dark:bg-input/30 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
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
