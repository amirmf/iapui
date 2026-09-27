import { Input, cn } from '@iap/ui'
import { tableFilterKeys } from '@shared/tables/filter/filter-utils'
import type {
  NumberRangeTableFilterConfig,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function TableFilterNumberRangeInput(
  props: NumberRangeTableFilterConfig & {
    onValueChange: (id: string, value: string | undefined) => void
    values: TableFilterValues
  }
) {
  const {
    className,
    fromPlaceholder = 'From',
    id,
    numberWithComma,
    onValueChange,
    toPlaceholder = 'To',
    values,
    wrapperClassName,
  } = props
  const fromKey = tableFilterKeys.numberFrom(id)
  const toKey = tableFilterKeys.numberTo(id)

  return (
    <div className={cn('flex gap-2', wrapperClassName, className)}>
      <Input
        numberWithComma={numberWithComma}
        onChange={(event) =>
          onValueChange(fromKey, event.target.value || undefined)
        }
        placeholder={fromPlaceholder}
        value={typeof values[fromKey] === 'string' ? values[fromKey] : ''}
      />
      <Input
        numberWithComma={numberWithComma}
        onChange={(event) =>
          onValueChange(toKey, event.target.value || undefined)
        }
        placeholder={toPlaceholder}
        value={typeof values[toKey] === 'string' ? values[toKey] : ''}
      />
    </div>
  )
}
