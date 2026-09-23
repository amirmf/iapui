import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'

import { cn } from '@iap/ui'

export type FormSectionProps = ComponentPropsWithoutRef<'fieldset'> & {
  description?: ReactNode
  title: ReactNode
}

export function FormSection(props: FormSectionProps) {
  const { children, className, description, title, ...rest } = props
  const descriptionId = useId()

  return (
    <fieldset
      aria-describedby={description ? descriptionId : undefined}
      className={cn('grid gap-4', className)}
      {...rest}
    >
      <legend className='text-foreground text-base font-semibold'>
        {title}
      </legend>
      {description ? (
        <p className='text-muted-foreground -mt-2 text-sm' id={descriptionId}>
          {description}
        </p>
      ) : null}
      {children}
    </fieldset>
  )
}
