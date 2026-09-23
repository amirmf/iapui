import type { ReactNode } from 'react'

import { Select, type SelectOption, cn } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from '../components/form'

export type SelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption extends SelectOption,
> = {
  control: Control<TFieldValues>
  description?: ReactNode
  getOptionDisabled?: (option: TOption) => boolean
  label: ReactNode
  labelKey: string
  name: TName
  options: readonly TOption[]
  placeholder?: ReactNode
  showSearch?: boolean
  searchKey?: string
  searchPlaceholder?: string
  valueKey: string
}

function SelectFieldControl<TOption extends SelectOption>(props: {
  field: {
    name: string
    onBlur: () => void
    onChange: (value: TOption | undefined) => void
    ref: (element: HTMLButtonElement | null) => void
    value: TOption | undefined
  }
  getOptionDisabled?: (option: TOption) => boolean
  label: ReactNode
  labelKey: string
  options: readonly TOption[]
  placeholder?: ReactNode
  showSearch?: boolean
  searchKey?: string
  searchPlaceholder?: string
  valueKey: string
}) {
  const {
    field,
    getOptionDisabled,
    label,
    labelKey,
    options,
    placeholder,
    showSearch,
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
      <Select
        aria-describedby={
          error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
        }
        aria-invalid={Boolean(error)}
        aria-labelledby={labelId}
        data-form-field={name}
        getOptionDisabled={getOptionDisabled}
        id={formItemId}
        labelKey={labelKey}
        name={field.name}
        onBlur={field.onBlur}
        onValueChange={field.onChange}
        options={options}
        placeholder={placeholder}
        showSearch={showSearch}
        ref={field.ref}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        value={field.value}
        valueKey={valueKey}
      />
    </>
  )
}

export function SelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption extends SelectOption,
>(props: SelectFieldProps<TFieldValues, TName, TOption>) {
  const {
    control,
    description,
    getOptionDisabled,
    label,
    labelKey,
    name,
    options,
    placeholder,
    showSearch,
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
          <SelectFieldControl
            field={field}
            getOptionDisabled={getOptionDisabled}
            label={label}
            labelKey={labelKey}
            options={options}
            placeholder={placeholder}
            showSearch={showSearch}
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
