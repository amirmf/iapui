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
import { formatDate } from './format-date'
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
  formatLabel?: (value: Date | undefined) => string
  separator?: string
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
  wrapperClassName?: string
  presentation?: 'default' | 'reference'
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
    formatLabel: customFormatLabel,
    separator,
    disabled = false,
    'data-form-field': dataFormField,
    'data-slot': dataSlot,
    fromPlaceholder = 'From',
    id,
    locale = 'fa',
    maxDate,
    minDate,
    mode = 'date',
    onBlur,
    onChange,
    ref,
    toPlaceholder = 'To',
    triggerClassName,
    wrapperClassName,
    presentation = 'default',
    value,
  } = props
  const isReference = presentation === 'reference'
  const formatLabel = (date?: Date) =>
    customFormatLabel && date
      ? customFormatLabel(date)
      : isReference && mode === 'date' && date
        ? formatDate(format(date, 'yyyy-MM-dd'))
        : formatRangeDate(date, locale, mode)
  const fromLabel = formatLabel(value.from) ?? fromPlaceholder
  const toLabel = formatLabel(value.to) ?? toPlaceholder

  return (
    <Popover>
      <div className={wrapperClassName}>
        <PopoverTrigger asChild>
          <Button
            presentation={presentation}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-labelledby={ariaLabelledBy}
            className={cn(
              'w-full justify-start font-normal',
              isReference && 'h-8',
              triggerClassName
            )}
            data-form-field={dataFormField}
            data-slot={dataSlot ?? 'date-range-picker-trigger'}
            disabled={disabled}
            id={id}
            onBlur={onBlur}
            ref={ref}
            type='button'
            variant='outline'
            size={isReference ? 'sm' : 'default'}
          >
            <span
              className={cn('truncate', !value.from && 'text-muted-foreground')}
            >
              {fromLabel}
            </span>
            <span aria-hidden='true' className='text-muted-foreground'>
              {separator ?? (isReference ? '-' : '–')}
            </span>
            <span
              className={cn('truncate', !value.to && 'text-muted-foreground')}
            >
              {toLabel}
            </span>
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        presentation={presentation}
        align='start'
        className={cn('w-80', isReference && 'p-3', className)}
      >
        <div className='flex gap-2'>
          <DatePicker
            presentation={presentation}
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
            presentation={presentation}
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
