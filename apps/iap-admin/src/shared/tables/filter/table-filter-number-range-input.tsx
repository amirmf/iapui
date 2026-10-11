import {
  fromNumberRangeKey,
  numWithComma,
  toNumberRangeKey,
} from '@iap/shared-lib'
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { tableFilterKeys } from '@shared/tables/filter/filter-utils'
import { TableFilterInput } from '@shared/tables/filter/table-filter-input'
import type {
  NumberRangeTableFilterConfig,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function TableFilterNumberRangeInput(
  props: NumberRangeTableFilterConfig & {
    onValueChange: (id: string, value: string | undefined) => void
    values: TableFilterValues
    presentation?: 'default' | 'reference'
  }
) {
  const {
    className,
    debounceMs = 1200,
    inputClassName,
    popoverClassName,
    presentation = 'default',
    fromPlaceholder,
    fromKey,
    id,
    numberWithComma,
    onValueChange,
    toPlaceholder,
    toKey,
    values,
    wrapperClassName,
  } = props
  const { t } = useTranslate()
  const isReference = presentation === 'reference'
  const resolvedFromKey =
    fromKey ??
    (isReference
      ? `${id}${fromNumberRangeKey}`
      : tableFilterKeys.numberFrom(id))
  const resolvedToKey =
    toKey ??
    (isReference ? `${id}${toNumberRangeKey}` : tableFilterKeys.numberTo(id))
  const fromValue =
    typeof values[resolvedFromKey] === 'string' ? values[resolvedFromKey] : ''
  const toValue =
    typeof values[resolvedToKey] === 'string' ? values[resolvedToKey] : ''
  const defaultFrom =
    fromPlaceholder || (isReference ? t('common.from') : 'From')
  const defaultTo = toPlaceholder || (isReference ? t('common.to') : 'To')
  const fromLabel = fromValue || defaultFrom
  const toLabel = toValue || defaultTo

  if (isReference) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className={wrapperClassName}>
            <Button
              presentation='reference'
              variant='outline'
              size='sm'
              className={cn(
                'h-8 w-full justify-start text-left font-normal lg:w-[250px]',
                className
              )}
            >
              <span
                className={cn(
                  'truncate',
                  fromLabel === defaultFrom && 'text-muted-foreground'
                )}
              >
                {numberWithComma ? numWithComma(fromLabel) : fromLabel}
              </span>
              <span className='text-muted-foreground'>-</span>
              <span
                className={cn(
                  'truncate',
                  toLabel === defaultTo && 'text-muted-foreground'
                )}
              >
                {numberWithComma ? numWithComma(toLabel) : toLabel}
              </span>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          presentation='reference'
          align='start'
          className={cn('w-[360px] p-3', popoverClassName)}
        >
          <div className='flex gap-2'>
            <TableFilterInput
              id={id}
              queryKey={resolvedFromKey}
              value={fromValue}
              placeholder={fromPlaceholder}
              numberWithComma={numberWithComma}
              debounceMs={debounceMs}
              className={cn('h-8 pe-8', inputClassName)}
              presentation='reference'
              onValueChange={onValueChange}
            />
            <TableFilterInput
              id={id}
              queryKey={resolvedToKey}
              value={toValue}
              placeholder={toPlaceholder}
              numberWithComma={numberWithComma}
              debounceMs={debounceMs}
              className={cn('h-8 pe-8', inputClassName)}
              presentation='reference'
              onValueChange={onValueChange}
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className={cn('flex gap-2', wrapperClassName, className)}>
      <TableFilterInput
        id={id}
        queryKey={resolvedFromKey}
        numberWithComma={numberWithComma}
        onValueChange={onValueChange}
        debounceMs={debounceMs}
        placeholder={defaultFrom}
        value={fromValue}
        className={inputClassName}
        wrapperClassName='min-w-0 flex-1'
      />
      <TableFilterInput
        id={id}
        queryKey={resolvedToKey}
        numberWithComma={numberWithComma}
        onValueChange={onValueChange}
        debounceMs={debounceMs}
        placeholder={defaultTo}
        value={toValue}
        className={inputClassName}
        wrapperClassName='min-w-0 flex-1'
      />
    </div>
  )
}
