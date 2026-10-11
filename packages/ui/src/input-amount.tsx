import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { Input, type InputProps } from './input'
import { cn } from './lib/cn'
import { numberToPersianWords, onlyNumberValue } from './lib/number-utils'

export interface InputAmountProps extends InputProps {
  unit?: 'rial' | 'toman'
  classNameNumberWord?: string
}

function Unit(props: { unit?: 'rial' | 'toman' }) {
  const { unit = 'rial' } = props
  const { t } = useTranslation() as { t: (key: string) => string }
  return (
    <span className='absolute top-[20%] left-2 text-sm font-medium'>
      {t(`common.${unit}`)}
    </span>
  )
}

export function InputAmount(props: InputAmountProps) {
  const { t } = useTranslation() as { t: (key: string) => string }
  const {
    className,
    classNameNumberWord,
    unit = 'rial',
    value,
    ...rest
  } = props
  const finalValue = useMemo(
    () => (value ? onlyNumberValue(String(value)) : ''),
    [value]
  )

  return (
    <div>
      <div className='relative'>
        <Input
          type='text'
          inputMode='decimal'
          numerical
          numberWithComma
          className={cn('pe-8', className)}
          value={value}
          {...rest}
        />
        <Unit unit={unit} />
      </div>
      <span
        className={cn(
          'text-secondary-700 text-xs font-semibold',
          classNameNumberWord
        )}
      >
        {numberToPersianWords(
          finalValue && Number(finalValue) > 10 ? Number(finalValue) / 10 : null
        )}{' '}
        {finalValue && Number(finalValue) > 10 && t('common.toman')}
      </span>
    </div>
  )
}

export default InputAmount
