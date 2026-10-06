import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from './lib/cn'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

function hasOverflow(element: HTMLDivElement | null) {
  return Boolean(
    element &&
    (element.offsetHeight < element.scrollHeight ||
      element.offsetWidth < element.scrollWidth)
  )
}

export function LongText(props: {
  children: ReactNode
  className?: string
  contentClassName?: string
  presentation?: 'default' | 'reference'
}) {
  const {
    children,
    className,
    contentClassName,
    presentation = 'default',
  } = props
  const ref = useRef<HTMLDivElement>(null)
  const [isOverflown, setIsOverflown] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateOverflow = () => setIsOverflown(hasOverflow(element))
    const observer = new ResizeObserver(updateOverflow)
    observer.observe(element)
    updateOverflow()

    return () => observer.disconnect()
  }, [])

  const text = (
    <div className={cn('truncate', className)} ref={ref}>
      {children}
    </div>
  )

  if (!isOverflown) return text

  return (
    <>
      <div className='hidden sm:block'>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{text}</TooltipTrigger>
            <TooltipContent presentation={presentation}>
              <p className={contentClassName}>{children}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className='sm:hidden'>
        <Popover>
          <PopoverTrigger asChild>{text}</PopoverTrigger>
          <PopoverContent
            presentation={presentation}
            className={cn('w-fit', contentClassName)}
          >
            <p>{children}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
