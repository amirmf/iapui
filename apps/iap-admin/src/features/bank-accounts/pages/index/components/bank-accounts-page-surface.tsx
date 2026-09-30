import type { ReactNode } from 'react'

import { cn } from '@iap/ui'

export function BankAccountsPageSurface(props: { children: ReactNode }) {
  const { children } = props
  return (
    <section
      className={cn(
        'flex w-full flex-col rounded-[20px] bg-card px-6 py-6 text-foreground shadow-sm sm:px-8 sm:py-8'
      )}
    >
      {children}
    </section>
  )
}
