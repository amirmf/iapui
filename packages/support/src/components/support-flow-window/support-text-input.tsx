import { type FormEvent, useState } from 'react'

import { Button } from '@iap/ui'
import { Textarea } from '@iap/ui'
import { SendHorizonal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type SupportTextInputProps = {
  placeholder: string
  disabled?: boolean
  onSubmit: (value: string) => void
}

export function SupportTextInput(props: SupportTextInputProps) {
  const { placeholder, disabled, onSubmit } = props
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedValue = value.trim()

    if (!trimmedValue || disabled) return

    onSubmit(trimmedValue)
    setValue('')
  }

  return (
    <form
      className='relative z-10 flex gap-2 border-t border-slate-200/80 bg-white/[0.88] px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-18px_45px_-28px_rgb(15_23_42/0.65)] backdrop-blur-xl sm:px-4 md:p-4 dark:border-white/10 dark:bg-slate-950/[0.86]'
      onSubmit={handleSubmit}
    >
      <Textarea
        presentation='reference'
        className='h-12 max-h-12 min-h-12 min-w-0 flex-1 resize-none rounded-xl border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm font-medium shadow-inner shadow-slate-200/60 placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:bg-white focus-visible:ring-sky-400/15 sm:rounded-2xl sm:px-4 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none dark:placeholder:text-slate-500 dark:focus-visible:border-sky-400/50 dark:focus-visible:bg-white/[0.08]'
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button
        presentation='reference'
        type='submit'
        size='icon'
        className='size-11 shrink-0 cursor-pointer rounded-xl bg-slate-900 shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:cursor-not-allowed sm:size-12 sm:rounded-2xl dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white'
        disabled={disabled || !value.trim()}
        aria-label={t('supportFlow.actions.send')}
      >
        <SendHorizonal className='size-4 rtl:rotate-180' aria-hidden='true' />
      </Button>
    </form>
  )
}
