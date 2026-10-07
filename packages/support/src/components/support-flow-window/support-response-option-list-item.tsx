import { Button } from '@iap/ui'
import { ChevronRight } from 'lucide-react'

import {
  type SupportFlowOption,
  type SupportFlowResponseOptionItem,
} from '../support-flow-types'
import { type SupportOptionDetail } from './support-option-list-types'

type SupportResponseOptionListItemProps = {
  details: SupportOptionDetail[]
  disabled?: boolean
  option: SupportFlowResponseOptionItem
  onSelect: (option: SupportFlowOption) => void
}

export function SupportResponseOptionListItem(
  props: SupportResponseOptionListItemProps
) {
  const { details, disabled, onSelect, option } = props
  const businessKey = getDetail(details, 'businessKey')
  const status = getDetail(details, 'status')
  const submitDate = getDetail(details, 'submitDate')
  const amount = getDetail(details, 'amount')
  const displayName = option.displayName?.trim()
  const shouldShowDisplayName = Boolean(
    displayName && displayName !== option.label
  )

  return (
    <Button
      presentation='reference'
      type='button'
      variant='outline'
      className='group h-full w-full cursor-pointer justify-between overflow-hidden rounded-xl border-s-4 border-slate-200/80 border-s-emerald-500 bg-white/[0.9] px-3 py-1 text-start leading-5 whitespace-normal shadow-sm ring-1 ring-transparent backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-950/10 hover:ring-emerald-100 sm:px-3.5 dark:border-white/10 dark:border-s-emerald-400 dark:bg-white/[0.06] dark:hover:border-emerald-400/30 dark:hover:bg-white/[0.09] dark:hover:shadow-black/25 dark:hover:ring-emerald-400/15'
      disabled={disabled}
      onClick={() => onSelect(option)}
    >
      <div className='flex h-full min-w-0 flex-1 flex-col justify-around pe-2'>
        {(businessKey || status || submitDate) && (
          <div className='flex min-w-0 items-start justify-between gap-2'>
            <div className='flex min-w-0 flex-1 flex-wrap items-start gap-1.5'>
              {businessKey ? (
                <span className='max-w-full min-w-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-start text-xs leading-4 font-semibold break-words whitespace-normal text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20'>
                  {businessKey.title}: {businessKey.value}
                </span>
              ) : null}
              {status ? (
                <span className='max-w-full min-w-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-start text-xs leading-4 font-medium break-words whitespace-normal text-slate-600 dark:bg-white/[0.09] dark:text-slate-300'>
                  {status.value}
                </span>
              ) : null}
            </div>

            {submitDate ? (
              <span className='shrink-0 truncate text-xs font-medium text-slate-500 dark:text-slate-400'>
                {submitDate.value}
              </span>
            ) : null}
          </div>
        )}

        <div className='mt-1 flex min-w-0 flex-wrap gap-x-1'>
          <span className='min-w-0 text-sm font-semibold break-words whitespace-normal text-slate-900 dark:text-slate-50'>
            {option.label}
          </span>
          {shouldShowDisplayName ? (
            <span className='min-w-0 text-xs font-medium break-words whitespace-normal text-slate-500 dark:text-slate-400'>
              {displayName}
            </span>
          ) : null}
        </div>

        {amount ? (
          <span className='mt-1 block truncate text-sm font-semibold text-slate-800 dark:text-slate-100'>
            {amount.title}: {amount.value}
          </span>
        ) : null}
      </div>
      <ChevronRight
        className='size-4 shrink-0 text-emerald-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-700 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-emerald-300'
        aria-hidden='true'
      />
    </Button>
  )
}

function getDetail(
  details: SupportOptionDetail[],
  field: SupportOptionDetail['field']
) {
  return details.find((detail) => detail.field === field)
}
