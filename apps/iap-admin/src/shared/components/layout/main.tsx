import type { HTMLAttributes, Ref } from 'react'

import { cn } from '@iap/ui'

type MainProps = HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: Ref<HTMLElement>
}

export function Main(props: MainProps) {
  const { fixed, className, ...rest } = props
  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'flex w-full flex-col rounded-[20px] bg-card px-6 py-6 text-foreground shadow-sm sm:px-8 sm:py-8',
        fixed && 'fixed-main grow overflow-hidden',
        className
      )}
      {...rest}
    />
  )
}
