import { type CSSProperties, type HTMLAttributes } from 'react'

import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type RowComponentProps } from 'react-window'

import { type SupportOptionRowProps } from './support-option-list-types'
import { SupportQuestionListItem } from './support-question-list-item'
import { SupportResponseOptionListItem } from './support-response-option-list-item'

export function SupportOptionRow(
  props: RowComponentProps<SupportOptionRowProps>
) {
  const {
    ariaAttributes,
    disabled,
    index,
    loadingRowIndex,
    onSelect,
    rows,
    style,
  } = props
  if (index === loadingRowIndex) {
    return (
      <SupportOptionLoadingRow ariaAttributes={ariaAttributes} style={style} />
    )
  }

  const row = rows[index]
  if (!row) return null
  const { details, option } = row

  return (
    <div {...ariaAttributes} style={style} className='pb-2'>
      {option.source === 'selectable-question' ? (
        <SupportQuestionListItem
          disabled={disabled}
          option={option}
          onSelect={onSelect}
        />
      ) : (
        <SupportResponseOptionListItem
          details={details}
          disabled={disabled}
          option={option}
          onSelect={onSelect}
        />
      )}
    </div>
  )
}

type SupportOptionLoadingRowProps = {
  ariaAttributes: HTMLAttributes<HTMLDivElement>
  style: CSSProperties
}

function SupportOptionLoadingRow(props: SupportOptionLoadingRowProps) {
  const { ariaAttributes, style } = props
  const { t } = useTranslation()

  return (
    <div
      {...ariaAttributes}
      style={style}
      className='flex items-center justify-center gap-2 pb-2 text-sm font-medium text-slate-500 dark:text-slate-400'
    >
      <Loader2 className='size-4 animate-spin' aria-hidden='true' />
      {t('supportFlow.loading')}
    </div>
  )
}
