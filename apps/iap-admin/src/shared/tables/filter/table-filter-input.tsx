import { useEffect, useState } from 'react'

import { Input, cn } from '@iap/ui'
import type { TextTableFilterConfig } from '@shared/tables/filter/types'
import { X } from 'lucide-react'

export function TableFilterInput(
  props: TextTableFilterConfig & {
    onValueChange: (id: string, value: string | undefined) => void
    value?: string
  }
) {
  const {
    className,
    debounceMs = 400,
    id,
    onValueChange,
    value = '',
    wrapperClassName,
    ...inputProps
  } = props
  const [text, setText] = useState(value)

  useEffect(() => setText(value), [value])
  useEffect(() => {
    const timeout = window.setTimeout(
      () => onValueChange(id, text.trim() || undefined),
      debounceMs
    )
    return () => window.clearTimeout(timeout)
  }, [debounceMs, id, onValueChange, text])

  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input
        {...inputProps}
        className={cn('pe-9', className)}
        onChange={(event) => setText(event.target.value)}
        value={text}
      />
      {text ? (
        <button
          aria-label={`Clear ${id}`}
          className='absolute end-2 top-1/2 size-7 -translate-y-1/2 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={() => setText('')}
          type='button'
        >
          <X aria-hidden='true' className='m-auto size-4' />
        </button>
      ) : null}
    </div>
  )
}
