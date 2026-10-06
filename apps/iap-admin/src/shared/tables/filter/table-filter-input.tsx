import { useEffect, useRef, useState } from 'react'

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
    queryKey,
    value = '',
    wrapperClassName,
    ...inputProps
  } = props
  const [text, setText] = useState(value)
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(pending.current)
    setText(value)
  }, [id, value])
  useEffect(() => () => clearTimeout(pending.current), [])

  const change = (next: string) => {
    setText(next)
    clearTimeout(pending.current)
    pending.current = setTimeout(
      () => onValueChange(queryKey ?? id, next.trim() || undefined),
      debounceMs
    )
  }
  const clear = () => {
    clearTimeout(pending.current)
    setText('')
    onValueChange(queryKey ?? id, undefined)
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input
        {...inputProps}
        className={cn('pe-9', className)}
        onChange={(event) => change(event.target.value)}
        value={text}
      />
      {text ? (
        <button
          aria-label='Clear input'
          className='absolute end-2 top-1/2 size-7 -translate-y-1/2 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={clear}
          type='button'
        >
          <X aria-hidden='true' className='m-auto size-4' />
        </button>
      ) : null}
    </div>
  )
}
