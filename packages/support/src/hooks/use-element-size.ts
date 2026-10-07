import { useCallback, useEffect, useState } from 'react'

type ElementSize = {
  height: number
  width: number
}

const EMPTY_SIZE: ElementSize = { height: 0, width: 0 }

export function useElementSize<TElement extends HTMLElement>() {
  const [element, setElement] = useState<TElement | null>(null)
  const [size, setSize] = useState<ElementSize>(EMPTY_SIZE)
  const ref = useCallback((node: TElement | null) => setElement(node), [])

  useEffect(() => {
    if (!element) return

    const updateSize = () => {
      const rect = element.getBoundingClientRect()
      setSize({
        height: Math.max(0, Math.floor(rect.height)),
        width: Math.max(0, Math.floor(rect.width)),
      })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(element)

    return () => observer.disconnect()
  }, [element])

  return { ref, size }
}
