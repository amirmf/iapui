import { useCallback, useEffect, useRef, useState } from 'react'

export default function useDebouncedTextSearch(props?: {
  time?: number
  useText?: boolean
}) {
  const { time, useText } = props ?? {}
  const [search, setSearch] = useState('')
  const [text, setText] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const onSearch = useCallback(
    (value: string) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setSearch(value.trim()), time || 700)
      if (useText) setText(value)
    },
    [time, useText]
  )
  return { search, text: useText ? text : '', setSearch: onSearch }
}
