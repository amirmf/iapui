import type { ReactNode } from 'react'

import { cn } from '@iap/ui'

export function OutpatientDocAcceptancesSurface(props: {
  children: ReactNode
}) {
  const { children } = props

  return (
    <section
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'flex w-full flex-col rounded-[20px] bg-card px-6 py-6 text-foreground shadow-sm sm:px-8 sm:py-8'
      )}
    >
      {children}
    </section>
  )
}
