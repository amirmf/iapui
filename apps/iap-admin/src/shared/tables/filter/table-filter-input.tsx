import { useEffect, useState } from 'react'

import { useDebouncedCallback } from '@iap/react-hooks'
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
    presentation = 'default',
    debounceMs = 1200,
    id,
    onValueChange,
    queryKey,
    value = '',
    wrapperClassName,
    ...inputProps
  } = props
  const [text, setText] = useState(value)
  const publish = useDebouncedCallback(
    (next: string) => onValueChange(queryKey ?? id, next.trim() || undefined),
    debounceMs
  )

  useEffect(() => {
    publish.cancel()
    setText(value)
  }, [id, queryKey, value, publish])

  const change = (next: string) => {
    setText(next)
    publish(next)
  }
  const clear = () => {
    publish.cancel()
    setText('')
    onValueChange(queryKey ?? id, undefined)
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input
        {...inputProps}
        className={cn(
          presentation === 'reference' ? 'pe-8' : 'pe-9',
          className
        )}
        onChange={(event) => change(event.target.value)}
        value={text}
      />
      {(presentation === 'reference' ? text.trim() : text) ? (
        <button
          aria-label='Clear input'
          className={cn(
            presentation === 'reference'
              ? 'absolute left-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground'
              : 'absolute end-2 top-1/2 size-7 -translate-y-1/2 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          onClick={clear}
          type='button'
        >
          <X aria-hidden='true' className='m-auto size-4' />
        </button>
      ) : null}
    </div>
  )
}
