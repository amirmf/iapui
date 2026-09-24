import type { Ref } from 'react'

import { format } from 'date-fns'
import DateObject from 'react-date-object'
import persian from 'react-date-object/calendars/persian'
import persianFa from 'react-date-object/locales/persian_fa'

import { Button } from './button'
import {
  DatePicker,
  type DatePickerLocale,
  type DatePickerMode,
} from './date-picker'
import { cn } from './lib/cn'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type DateRangeValue = {
  from?: Date
  to?: Date
}

export type DateRangePickerProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-labelledby'?: string
  className?: string
  clearLabel?: string
  disabled?: boolean
  'data-form-field'?: string
  'data-slot'?: string
  fromPlaceholder?: string
  id?: string
  locale?: DatePickerLocale
  maxDate?: Date
  minDate?: Date
  mode?: DatePickerMode
  onBlur?: () => void
  onChange: (value: DateRangeValue) => void
  ref?: Ref<HTMLButtonElement>
  toPlaceholder?: string
  triggerClassName?: string
  value: DateRangeValue
}

function formatRangeDate(
  value: Date | undefined,
  locale: DatePickerLocale,
  mode: DatePickerMode
) {
  if (!value || Number.isNaN(value.getTime())) return undefined
  if (locale === 'fa') {
    return new DateObject({
      calendar: persian,
      date: value,
      locale: persianFa,
    }).format(mode === 'date-time' ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD')
  }

  return format(
    value,
    mode === 'date-time' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
  )
}

export function DateRangePicker(props: DateRangePickerProps) {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    className,
    clearLabel,
    disabled = false,
    'data-form-field': dataFormField,
    'data-slot': dataSlot,
    fromPlaceholder = 'From',
    locale = 'fa',
    maxDate,
    minDate,
    mode = 'date',
    onBlur,
    onChange,
    ref,
    toPlaceholder = 'To',
    triggerClassName,
    value,
  } = props
  const fromLabel = formatRangeDate(value.from, locale, mode) ?? fromPlaceholder
  const toLabel = formatRangeDate(value.to, locale, mode) ?? toPlaceholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          aria-labelledby={ariaLabelledBy}
          className={cn('w-full justify-start font-normal', triggerClassName)}
          data-form-field={dataFormField}
          data-slot={dataSlot ?? 'date-range-picker-trigger'}
          disabled={disabled}
          id={props.id}
          onBlur={onBlur}
          ref={ref}
          type='button'
          variant='outline'
        >
          <span
            className={cn('truncate', !value.from && 'text-muted-foreground')}
          >
            {fromLabel}
          </span>
          <span aria-hidden='true' className='text-muted-foreground'>
            –
          </span>
          <span
            className={cn('truncate', !value.to && 'text-muted-foreground')}
          >
            {toLabel}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className={cn('w-80', className)}>
        <div className='flex gap-2'>
          <DatePicker
            clearLabel={clearLabel}
            disabled={disabled}
            locale={locale}
            maxDate={maxDate}
            minDate={minDate}
            mode={mode}
            onChange={(from) => onChange({ ...value, from })}
            placeholder={fromPlaceholder}
            value={value.from}
          />
          <DatePicker
            clearLabel={clearLabel}
            disabled={disabled}
            locale={locale}
            maxDate={maxDate}
            minDate={minDate}
            mode={mode}
            onChange={(to) => onChange({ ...value, to })}
            placeholder={toPlaceholder}
            value={value.to}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
