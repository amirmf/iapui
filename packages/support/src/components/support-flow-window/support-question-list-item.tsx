import { Button } from '@iap/ui'
import { ChevronRight } from 'lucide-react'

import {
  type SupportFlowOption,
  type SupportFlowQuestionItem,
} from '../support-flow-types'

type SupportQuestionListItemProps = {
  disabled?: boolean
  option: SupportFlowQuestionItem
  onSelect: (option: SupportFlowOption) => void
}

export function SupportQuestionListItem(props: SupportQuestionListItemProps) {
  const { disabled, onSelect, option } = props
  return (
    <Button
      presentation='reference'
      type='button'
      variant='outline'
      className='group h-full w-full cursor-pointer justify-between overflow-hidden rounded-xl border-s-4 border-slate-200/80 border-s-sky-500 bg-white/[0.9] px-3 py-2.5 text-start leading-6 whitespace-normal shadow-sm ring-1 ring-transparent backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-lg hover:shadow-sky-950/10 hover:ring-sky-100 sm:px-3.5 sm:py-3 dark:border-white/10 dark:border-s-sky-400 dark:bg-white/[0.06] dark:hover:border-sky-400/30 dark:hover:bg-white/[0.09] dark:hover:shadow-black/25 dark:hover:ring-sky-400/15'
      disabled={disabled}
      onClick={() => onSelect(option)}
    >
      <span className='flex min-w-0 flex-1 flex-col pe-2 text-start'>
        <span className='font-semibold break-words whitespace-normal text-slate-900 dark:text-slate-50'>
          {option.label}
        </span>
      </span>
      <ChevronRight
        className='size-4 shrink-0 text-sky-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-sky-700 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-sky-300'
        aria-hidden='true'
      />
    </Button>
  )
}
