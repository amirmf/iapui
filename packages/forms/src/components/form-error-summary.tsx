import type { HTMLAttributes, ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'

import { cn } from '@iap/ui'
import type { FieldErrors, FieldValues } from 'react-hook-form'
import { useFormState } from 'react-hook-form'

type ErrorSummaryItem = {
  message: string
  name: string
}

function flattenFieldErrors(
  errors: FieldErrors<FieldValues>,
  parentPath = ''
): ErrorSummaryItem[] {
  return Object.entries(errors).flatMap(([key, value]) => {
    const name = parentPath ? `${parentPath}.${key}` : key

    if (!value || typeof value !== 'object') {
      return []
    }

    if ('message' in value) {
      return value.message ? [{ message: String(value.message), name }] : []
    }

    return flattenFieldErrors(value as FieldErrors<FieldValues>, name)
  })
}

function findFieldControl(name: string) {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-form-field]')
  ).find((element) => element.dataset.formField === name)
}

export type FormErrorSummaryProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> & {
  title: ReactNode
}

export function FormErrorSummary(props: FormErrorSummaryProps) {
  const { className, title, ...rest } = props
  const { errors, submitCount } = useFormState()
  const summaryRef = useRef<HTMLDivElement>(null)
  const previousSubmitCount = useRef(submitCount)
  const titleId = useId()
  const items = flattenFieldErrors(errors)

  useEffect(() => {
    const submitted = submitCount > previousSubmitCount.current
    previousSubmitCount.current = submitCount

    if (submitted && items.length > 0) {
      const timeout = window.setTimeout(() => summaryRef.current?.focus())
      return () => window.clearTimeout(timeout)
    }
  }, [items.length, submitCount])

  if (items.length === 0) {
    return null
  }

  return (
    <div
      aria-labelledby={titleId}
      className={cn(
        'border-destructive bg-destructive/10 text-foreground rounded-lg border p-4',
        className
      )}
      ref={summaryRef}
      role='alert'
      tabIndex={-1}
      {...rest}
    >
      <h2 className='font-semibold' id={titleId}>
        {title}
      </h2>
      <ul className='mt-2 list-inside list-disc space-y-1'>
        {items.map((item) => {
          const control = findFieldControl(item.name)

          if (!control?.id) {
            return <li key={item.name}>{item.message}</li>
          }

          return (
            <li key={item.name}>
              <a
                className='text-destructive focus-visible:ring-ring focus-visible:ring-offset-background underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                href={`#${control.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  control.focus()
                }}
              >
                {item.message}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
