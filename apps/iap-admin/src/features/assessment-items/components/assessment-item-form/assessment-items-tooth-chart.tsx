import { useRef } from 'react'

import { cn } from '@iap/ui'

interface ToothChartProps {
  value?: number[] | null
  onSelect: (toothNumber: number[]) => void
  isChild?: boolean
}

const BASE_NUMBER_TOOTH = [2, 1, 3, 4]
const BASE_NUMBER_TOOTH_CHILD = [6, 5, 7, 8]

const TEETH = Array.from({ length: 8 }, (_, index) => index + 1)
const TEERH_Child = Array.from({ length: 5 }, (_, index) => index + 1)

export function AssessmentItemsToothChart(props: ToothChartProps) {
  const { value, onSelect, isChild } = props
  const baseNumberList = isChild ? BASE_NUMBER_TOOTH_CHILD : BASE_NUMBER_TOOTH
  const teethList = isChild ? TEERH_Child : TEETH

  return (
    <div className='mx-auto grid max-w-fit grid-cols-2'>
      {baseNumberList.map((baseItem, index) => (
        <div
          key={`${baseItem}${index}`}
          className={cn(
            'flex items-center overflow-auto border-gray-300 p-2',
            index % 2 === 0 && 'flex-row-reverse',
            index === 0 && 'border-b border-l',
            index === 1 && 'border-b',
            index === 2 && 'border-l'
          )}
        >
          {teethList.map((item) => {
            const toothNumber = Number(`${baseItem}${item}`)
            const isSelected = value?.includes(toothNumber)
            return (
              <JawCard
                key={toothNumber}
                toothNumber={toothNumber}
                isSelected={isSelected}
                onSelect={(toothNumber) => {
                  const tmpValue = value?.filter(
                    (item) => item < 90 && item < 900
                  )
                  if (isSelected) {
                    const finalValue =
                      tmpValue?.filter((item) => item !== toothNumber) ?? []
                    onSelect(finalValue)
                  } else {
                    onSelect(tmpValue?.concat(toothNumber) ?? [toothNumber])
                  }
                }}
                label={item}
                // lastTranslate={lastTranslate}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

interface JawCardProps {
  isSelected?: boolean
  toothNumber: number
  onSelect: (toothNumber: number) => void
  lastTranslate?: string
  label?: number
}

function JawCard(props: JawCardProps) {
  const { isSelected, toothNumber, onSelect, lastTranslate, label } = props
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={btnRef}
      type='button'
      aria-pressed={isSelected}
      aria-label={`tooth ${toothNumber}`}
      // title={`Tooth ${toothNumber}`}
      onClick={() => onSelect(toothNumber)}
      className={cn(
        'rounded border-border px-1 text-gray-600 outline-0 even:border-x sm:px-2 min-[1120px]:px-1.5 min-[1280px]:px-2 min-[1400px]:px-1.5 2xl:px-2',
        isSelected && 'bg-primary/10 text-primary'
      )}
    >
      <span className='whitespace-nowrap text-xs font-semibold'>
        {lastTranslate || label || toothNumber}
      </span>
    </button>
  )
}
