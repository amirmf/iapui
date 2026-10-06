import { useEffect, useRef, useState } from 'react'

import { Input, cn } from '@iap/ui'
import type { TextTableFilterConfig } from '@shared/tables/filter/types'
import { X } from 'lucide-react'

export function TableFilterInput(
  props: TextTableFilterConfig & {
    onValueChange: (id: string, value: string | undefined) => void
    value?: string
    presentation?: 'default' | 'reference'
  }
) {
  const {
    className,
    debounceMs,
    id,
    onValueChange,
    queryKey,
    presentation = 'default',
    value = '',
    wrapperClassName,
    ...inputProps
  } = props
  const [text, setText] = useState(value)
  const dirty = useRef(false)
  const skipNext = useRef(false)

  useEffect(() => setText(value), [value])
  useEffect(() => {
    if (presentation === 'reference' && (!dirty.current || skipNext.current)) {
      skipNext.current = false
      return
    }
    const timeout = window.setTimeout(
      () => onValueChange(queryKey ?? id, text.trim() || undefined),
      debounceMs ?? (presentation === 'reference' ? 1200 : 400)
    )
    return () => window.clearTimeout(timeout)
  }, [debounceMs, onValueChange, presentation, queryKey, id, text])

  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input
        {...inputProps}
        className={cn(
          presentation === 'reference' && 'pe-8',
          presentation !== 'reference' && 'pe-9',
          className
        )}
        onChange={(event) => {
          dirty.current = true
          setText(event.target.value)
        }}
        value={text}
      />
      {text.trim() ? (
        <button
          aria-label={
            presentation === 'reference' ? 'Clear input' : `Clear ${id}`
          }
          className={cn(
            presentation === 'reference' &&
              'absolute left-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground',
            presentation !== 'reference' &&
              'absolute end-2 top-1/2 size-7 -translate-y-1/2 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          onClick={() => {
            setText('')
            if (presentation === 'reference') {
              skipNext.current = true
              onValueChange(queryKey ?? id, undefined)
            }
          }}
          type='button'
        >
          <X aria-hidden='true' className='m-auto size-4' />
        </button>
      ) : null}
    </div>
  )
}
