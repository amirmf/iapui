import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type Ref,
  useEffect,
  useState,
} from 'react'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Calendar, CalendarDays, X } from 'lucide-react'
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
  clearable?: boolean
  disabled?: boolean
  editable?: boolean
  id?: string
  locale?: DatePickerLocale
  maxDate?: Date
  minDate?: Date
  mode?: DatePickerMode
  name?: string
  onBlur?: () => void
  onChange?: (value: Date | undefined) => void
  onSelect?: (value: Date | undefined) => void
  placeholder?: string
  presentation?: 'default' | 'reference'
  ref?: Ref<HTMLInputElement>
  selected?: Date
  showClear?: boolean
  value?: Date
}

type CalendarInputProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  clearLabel: string
  clearable: boolean
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
  presentation: 'default' | 'reference'
  readOnly: boolean
  showClear: boolean
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
    clearable,
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
    presentation,
    readOnly,
    ref,
    showClear,
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
        className={cn(
          presentation === 'reference' && 'pr-10',
          presentation === 'reference' && hasValue && 'pl-10',
          presentation !== 'reference' && 'cursor-pointer pe-10',
          presentation !== 'reference' && hasValue && 'ps-12'
        )}
      />
      {presentation === 'reference' ? (
        <Calendar
          aria-hidden='true'
          className='pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-50'
        />
      ) : (
        <CalendarDays
          aria-hidden='true'
          className='text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2'
        />
      )}
      {hasValue && showClear && clearable ? (
        <button
          aria-label={clearLabel}
          className={cn(
            presentation === 'reference' &&
              'text-muted-foreground hover:text-foreground absolute top-1/2 left-3 -translate-y-1/2',
            presentation !== 'reference' &&
              'text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring absolute start-1 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          )}
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onClear()
          }}
          type='button'
        >
          {presentation === 'reference' ? (
            <Cross2Icon aria-hidden='true' className='h-4 w-4' />
          ) : (
            <X aria-hidden='true' className='size-4' />
          )}
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
    clearable = true,
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
    onSelect,
    placeholder,
    presentation = 'default',
    ref,
    selected,
    showClear = true,
    value,
  } = props
  const resolvedValue = selected ?? value
  const resolvedOnChange = onSelect ?? onChange ?? (() => {})
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (presentation !== 'reference' || typeof window.matchMedia !== 'function')
      return
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(window.innerWidth < 768)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [presentation])
  const [isTyping, setIsTyping] = useState(false)
  const [typedValue, setTypedValue] = useState(() =>
    formatPersianDate(resolvedValue, mode)
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
      : formatPersianDate(resolvedValue, mode)
    : undefined

  useEffect(() => {
    if (!isTyping) {
      setTypedValue(formatPersianDate(resolvedValue, mode))
    }
  }, [isTyping, mode, resolvedValue])

  const clear = () => {
    setIsTyping(false)
    setTypedValue('')
    resolvedOnChange(undefined)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return
    const nextValue = formatPersianInput(event.target.value)
    setIsTyping(true)
    setTypedValue(nextValue)

    if (!nextValue) {
      resolvedOnChange(undefined)
      return
    }

    const parsed = parsePersianDate(nextValue)
    if (parsed) resolvedOnChange(parsed)
  }

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (!canEdit) return
    const parsed = parsePersianDate(event.target.value)
    setIsTyping(false)
    setTypedValue(formatPersianDate(parsed ?? resolvedValue, mode))
    if (parsed) resolvedOnChange(parsed)
  }

  const handleCalendarChange = (nextValue: DateObject | null) => {
    const nextDate = nextValue?.toDate()
    setIsTyping(false)
    setTypedValue(formatPersianDate(nextDate, mode))
    resolvedOnChange(nextDate)
  }

  return (
    <MultiDatePicker
      calendar={calendarConfig.calendar}
      calendarPosition='bottom-center'
      className={cn(
        'custom-calendar pointer-events-auto',
        presentation === 'reference' && 'reference-calendar',
        presentation === 'reference' && isMobile && 'rmdp-mobile',
        calendarClassName
      )}
      containerClassName={cn('w-full', className)}
      currentDate={
        mode === 'date-time' && resolvedValue
          ? new DateObject(resolvedValue)
          : undefined
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
          clearable={clearable}
          aria-describedby={props['aria-describedby']}
          aria-invalid={props['aria-invalid']}
          dataFormField={dataFormField}
          dataSlot={dataSlot}
          disabled={disabled}
          hasValue={isValidDate(resolvedValue)}
          id={id}
          inputValue={inputValue}
          name={name}
          onBlur={onBlur}
          onClear={clear}
          onInputBlur={canEdit ? handleInputBlur : undefined}
          onInputChange={canEdit ? handleInputChange : undefined}
          placeholder={placeholder}
          presentation={presentation}
          showClear={showClear}
          readOnly={!canEdit}
          ref={ref}
        />
      }
      value={value}
    />
  )
}
