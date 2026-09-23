import type { ReactNode } from 'react'

import { MultiSelect, type SelectOption, cn } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from '../components/form'

export type MultiSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption extends SelectOption,
> = {
  control: Control<TFieldValues>
  description?: ReactNode
  getOptionDisabled?: (option: TOption) => boolean
  label: ReactNode
  labelKey: string
  maxVisibleItems?: number
  name: TName
  options: readonly TOption[]
  placeholder?: ReactNode
  searchKey?: string
  searchPlaceholder?: string
  valueKey: string
}

function MultiSelectFieldControl<TOption extends SelectOption>(props: {
  field: {
    name: string
    onBlur: () => void
    onChange: (value: TOption[]) => void
    ref: (element: HTMLElement | null) => void
    value: TOption[]
  }
  getOptionDisabled?: (option: TOption) => boolean
  label: ReactNode
  labelKey: string
  maxVisibleItems?: number
  options: readonly TOption[]
  placeholder?: ReactNode
  searchKey?: string
  searchPlaceholder?: string
  valueKey: string
}) {
  const {
    field,
    getOptionDisabled,
    label,
    labelKey,
    maxVisibleItems,
    options,
    placeholder,
    searchKey,
    searchPlaceholder,
    valueKey,
  } = props
  const { error, formDescriptionId, formItemId, formMessageId, name } =
    useFormField()
  const labelId = `${formItemId}-label`

  return (
    <>
      <span
        className={cn(error && 'text-destructive', 'text-sm font-medium')}
        id={labelId}
      >
        {label}
      </span>
      <MultiSelect
        aria-describedby={
          error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
        }
        aria-invalid={Boolean(error)}
        aria-labelledby={labelId}
        data-form-field={name}
        getOptionDisabled={getOptionDisabled}
        id={formItemId}
        labelKey={labelKey}
        maxVisibleItems={maxVisibleItems}
        name={field.name}
        onBlur={field.onBlur}
        onValueChange={field.onChange}
        options={options}
        placeholder={placeholder}
        ref={field.ref}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        value={field.value ?? []}
        valueKey={valueKey}
      />
    </>
  )
}

export function MultiSelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption extends SelectOption,
>(props: MultiSelectFieldProps<TFieldValues, TName, TOption>) {
  const {
    control,
    description,
    getOptionDisabled,
    label,
    labelKey,
    maxVisibleItems,
    name,
    options,
    placeholder,
    searchKey,
    searchPlaceholder,
    valueKey,
  } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <MultiSelectFieldControl
            field={field}
            getOptionDisabled={getOptionDisabled}
            label={label}
            labelKey={labelKey}
            maxVisibleItems={maxVisibleItems}
            options={options}
            placeholder={placeholder}
            searchKey={searchKey}
            searchPlaceholder={searchPlaceholder}
            valueKey={valueKey}
          />
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
