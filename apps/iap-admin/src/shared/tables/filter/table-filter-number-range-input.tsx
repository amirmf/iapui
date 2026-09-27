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
    fromKey,
    id,
    numberWithComma,
    onValueChange,
    toPlaceholder = 'To',
    toKey,
    values,
    wrapperClassName,
  } = props
  const resolvedFromKey = fromKey ?? tableFilterKeys.numberFrom(id)
  const resolvedToKey = toKey ?? tableFilterKeys.numberTo(id)

  return (
    <div className={cn('flex gap-2', wrapperClassName, className)}>
      <Input
        numberWithComma={numberWithComma}
        onChange={(event) =>
          onValueChange(resolvedFromKey, event.target.value || undefined)
        }
        placeholder={fromPlaceholder}
        value={
          typeof values[resolvedFromKey] === 'string'
            ? values[resolvedFromKey]
            : ''
        }
      />
      <Input
        numberWithComma={numberWithComma}
        onChange={(event) =>
          onValueChange(resolvedToKey, event.target.value || undefined)
        }
        placeholder={toPlaceholder}
        value={
          typeof values[resolvedToKey] === 'string' ? values[resolvedToKey] : ''
        }
      />
    </div>
  )
}
