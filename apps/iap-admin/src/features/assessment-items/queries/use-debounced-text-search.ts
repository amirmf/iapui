import { useCallback, useState } from 'react'

import { useDebouncedCallback } from '@iap/react-hooks'

export default function useDebouncedTextSearch(props?: {
  time?: number
  useText?: boolean
}) {
  const { time, useText } = props ?? {}
  const [search, setSearch] = useState('')
  const [text, setText] = useState('')
  const publish = useDebouncedCallback(
    (value: string) => setSearch(value.trim()),
    time || 700
  )
  const onSearch = useCallback(
    (value: string) => {
      publish(value)
      if (useText) setText(value)
    },
    [publish, useText]
  )
  return { search, text: useText ? text : '', setSearch: onSearch }
}
