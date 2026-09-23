import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import { cloneElement, createContext, useContext, useId } from 'react'

import { Label, cn } from '@iap/ui'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form'

export const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: ControllerProps<TFieldValues, TName, TTransformedValues>) {
  const { name, ...rest } = props

  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} {...rest} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

export function useFormField() {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)

  if (!fieldContext || !itemContext) {
    throw new Error('useFormField must be used within FormField and FormItem.')
  }

  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formDescriptionId: `${id}-form-item-description`,
    formItemId: `${id}-form-item`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

export function FormItem(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props
  const id = useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={cn('grid gap-2', className)}
        data-slot='form-item'
        {...rest}
      />
    </FormItemContext.Provider>
  )
}

export function FormLabel(props: ComponentPropsWithoutRef<typeof Label>) {
  const { className, ...rest } = props
  const { error, formItemId } = useFormField()

  return (
    <Label
      className={cn('data-[error=true]:text-destructive', className)}
      data-error={Boolean(error)}
      data-slot='form-label'
      htmlFor={formItemId}
      {...rest}
    />
  )
}

type FormControlChildProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'data-form-field'?: string
  'data-slot'?: string
  id?: string
}

export function FormControl(props: {
  children: ReactElement<FormControlChildProps>
}) {
  const { children } = props
  const { error, formDescriptionId, formItemId, formMessageId, name } =
    useFormField()
  const describedBy = error
    ? `${formDescriptionId} ${formMessageId}`
    : formDescriptionId

  return cloneElement<FormControlChildProps>(children, {
    'aria-describedby': describedBy,
    'aria-invalid': Boolean(error),
    'data-form-field': name,
    'data-slot': 'form-control',
    id: formItemId,
  })
}

export function FormDescription(props: ComponentPropsWithoutRef<'p'>) {
  const { className, ...rest } = props
  const { formDescriptionId } = useFormField()

  return (
    <p
      className={cn('text-muted-foreground text-sm', className)}
      data-slot='form-description'
      id={formDescriptionId}
      {...rest}
    />
  )
}

export function FormMessage(props: ComponentPropsWithoutRef<'p'>) {
  const { children, className, ...rest } = props
  const { error, formMessageId, name } = useFormField()
  const body = error?.message ? String(error.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      className={cn('text-destructive text-sm', className)}
      data-message-error={name}
      data-slot='form-message'
      id={formMessageId}
      role='alert'
      {...rest}
    >
      {body}
    </p>
  )
}
