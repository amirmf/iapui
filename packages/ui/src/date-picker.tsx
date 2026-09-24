import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type Ref,
  useEffect,
  useState,
} from 'react'

import { CalendarDays, X } from 'lucide-react'
import DateObject from 'react-date-object'
import gregorian from 'react-date-object/calendars/gregorian'
import persian from 'react-date-object/calendars/persian'
import gregorianEn from 'react-date-object/locales/gregorian_en'
import persianFa from 'react-date-object/locales/persian_fa'
import MultiDatePicker from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import 'react-multi-date-picker/styles/layouts/mobile.css'

import './date-picker.css'
import { Input } from './input'
import { cn } from './lib/cn'

export type DatePickerLocale = 'en' | 'fa'
export type DatePickerMode = 'date' | 'date-time'

export type DatePickerProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'data-form-field'?: string
  'data-slot'?: string
  calendarClassName?: string
  className?: string
  clearLabel?: string
  disabled?: boolean
  editable?: boolean
  id?: string
  locale?: DatePickerLocale
  maxDate?: Date
  minDate?: Date
  mode?: DatePickerMode
  name?: string
  onBlur?: () => void
  onChange: (value: Date | undefined) => void
  placeholder?: string
  ref?: Ref<HTMLInputElement>
  value?: Date
}

type CalendarInputProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  clearLabel: string
  dataFormField?: string
  dataSlot?: string
  disabled?: boolean
  hasValue: boolean
  id?: string
  inputValue?: string
  name?: string
  onBlur?: () => void
  onClear: () => void
  onInputBlur?: (event: FocusEvent<HTMLInputElement>) => void
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  openCalendar?: () => void
  placeholder?: string
  readOnly: boolean
  ref?: Ref<HTMLInputElement>
  value?: string
}

const PERSIAN_DATE_FORMAT = 'YYYY/MM/DD'
const PERSIAN_DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm:ss'
const GREGORIAN_DATE_FORMAT = 'MMM D, YYYY'
const GREGORIAN_DATE_TIME_FORMAT = 'MMM D, YYYY HH:mm:ss'
const MIN_SUPPORTED_DATE = new Date('1900-01-01')

function isValidDate(value: Date | undefined) {
  return value !== undefined && !Number.isNaN(value.getTime())
}

function toLatinDigits(value: string) {
  return value.replace(/[\u06F0-\u06F9]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 0x06f0 + 48)
  )
}

function formatPersianDate(value: Date | undefined, mode: DatePickerMode) {
  if (!isValidDate(value)) return ''

  return new DateObject({
    calendar: persian,
    date: value,
    locale: persianFa,
  }).format(
    mode === 'date-time' ? PERSIAN_DATE_TIME_FORMAT : PERSIAN_DATE_FORMAT
  )
}

function parsePersianDate(value: string) {
  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(value)) return undefined

  try {
    const parsed = new DateObject({
      calendar: persian,
      date: value,
      format: PERSIAN_DATE_FORMAT,
      locale: persianFa,
    }).toDate()

    return isValidDate(parsed) && parsed >= MIN_SUPPORTED_DATE
      ? parsed
      : undefined
  } catch {
    return undefined
  }
}

function formatPersianInput(value: string) {
  const digits = toLatinDigits(value).replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 4) return digits
  if (digits.length <= 6) return `${digits.slice(0, 4)}/${digits.slice(4)}`
  return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6)}`
}

function CalendarInput(props: CalendarInputProps) {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    clearLabel,
    dataFormField,
    dataSlot,
    disabled,
    hasValue,
    id,
    inputValue,
    name,
    onBlur,
    onClear,
    onInputBlur,
    onInputChange,
    onKeyDown,
    openCalendar,
    placeholder,
    readOnly,
    ref,
    value,
  } = props

  return (
    <div className='relative'>
      <Input
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        data-form-field={dataFormField}
        data-slot={dataSlot ?? 'date-picker-input'}
        disabled={disabled}
        id={id}
        name={name}
        onBlur={(event) => {
          onInputBlur?.(event)
          onBlur?.()
        }}
        onChange={onInputChange}
        onClick={openCalendar}
        onKeyDown={onKeyDown}
        onFocus={openCalendar}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={ref}
        value={inputValue ?? value ?? ''}
        className={cn('cursor-pointer pe-10', hasValue && 'ps-12')}
      />
      <CalendarDays
        aria-hidden='true'
        className='text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2'
      />
      {hasValue ? (
        <button
          aria-label={clearLabel}
          className='text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring absolute start-1 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onClear()
          }}
          type='button'
        >
          <X aria-hidden='true' className='size-4' />
        </button>
      ) : null}
    </div>
  )
}

export function DatePicker(props: DatePickerProps) {
  const {
    'data-form-field': dataFormField,
    'data-slot': dataSlot,
    calendarClassName,
    className,
    clearLabel = 'Clear date',
    disabled = false,
    editable = false,
    id,
    locale = 'fa',
    maxDate,
    minDate = MIN_SUPPORTED_DATE,
    mode = 'date',
    name,
    onBlur,
    onChange,
    placeholder,
    ref,
    value,
  } = props
  const [isTyping, setIsTyping] = useState(false)
  const [typedValue, setTypedValue] = useState(() =>
    formatPersianDate(value, mode)
  )
  const isPersian = locale === 'fa'
  const canEdit = editable && isPersian && mode === 'date' && !disabled
  const dateFormat = isPersian
    ? mode === 'date-time'
      ? PERSIAN_DATE_TIME_FORMAT
      : PERSIAN_DATE_FORMAT
    : mode === 'date-time'
      ? GREGORIAN_DATE_TIME_FORMAT
      : GREGORIAN_DATE_FORMAT
  const calendarConfig = isPersian
    ? { calendar: persian, locale: persianFa }
    : { calendar: gregorian, locale: gregorianEn }
  const inputValue = isPersian
    ? isTyping
      ? typedValue
      : formatPersianDate(value, mode)
    : undefined

  useEffect(() => {
    if (!isTyping) {
      setTypedValue(formatPersianDate(value, mode))
    }
  }, [isTyping, mode, value])

  const clear = () => {
    setIsTyping(false)
    setTypedValue('')
    onChange(undefined)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return
    const nextValue = formatPersianInput(event.target.value)
    setIsTyping(true)
    setTypedValue(nextValue)

    if (!nextValue) {
      onChange(undefined)
      return
    }

    const parsed = parsePersianDate(nextValue)
    if (parsed) onChange(parsed)
  }

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (!canEdit) return
    const parsed = parsePersianDate(event.target.value)
    setIsTyping(false)
    setTypedValue(formatPersianDate(parsed ?? value, mode))
    if (parsed) onChange(parsed)
  }

  const handleCalendarChange = (nextValue: DateObject | null) => {
    const nextDate = nextValue?.toDate()
    setIsTyping(false)
    setTypedValue(formatPersianDate(nextDate, mode))
    onChange(nextDate)
  }

  return (
    <MultiDatePicker
      calendar={calendarConfig.calendar}
      calendarPosition='bottom-center'
      className={cn('custom-calendar pointer-events-auto', calendarClassName)}
      containerClassName={cn('w-full', className)}
      currentDate={
        mode === 'date-time' && value ? new DateObject(value) : undefined
      }
      disabled={disabled}
      editable={canEdit}
      format={dateFormat}
      locale={calendarConfig.locale}
      mapDays={
        isPersian
          ? ({ date }) =>
              date.weekDay.index === 6 ? { className: 'day-weekend' } : {}
          : undefined
      }
      maxDate={maxDate}
      minDate={minDate}
      onChange={handleCalendarChange}
      onOpenPickNewDate={false}
      plugins={
        mode === 'date-time'
          ? [<TimePicker key='time-picker' position='bottom' />]
          : undefined
      }
      portal
      placeholder={placeholder}
      render={
        <CalendarInput
          clearLabel={clearLabel}
          aria-describedby={props['aria-describedby']}
          aria-invalid={props['aria-invalid']}
          dataFormField={dataFormField}
          dataSlot={dataSlot}
          disabled={disabled}
          hasValue={isValidDate(value)}
          id={id}
          inputValue={inputValue}
          name={name}
          onBlur={onBlur}
          onClear={clear}
          onInputBlur={canEdit ? handleInputBlur : undefined}
          onInputChange={canEdit ? handleInputChange : undefined}
          placeholder={placeholder}
          readOnly={!canEdit}
          ref={ref}
        />
      }
      value={value}
    />
  )
}
