import { Textarea } from '@iap/ui'
import type { TextareaHTMLAttributes } from 'react'

export type RepetitiveResponseTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isBusy?: boolean
  onValueChange?: (value: string) => void
  value: string
}

export function RepetitiveResponseTextarea(props: RepetitiveResponseTextareaProps) {
  const { isBusy = false, onValueChange, onChange, value, ...rest } = props
  return <Textarea {...rest} disabled={isBusy || rest.disabled} onChange={(event) => { onChange?.(event); onValueChange?.(event.target.value) }} value={value} />
}
