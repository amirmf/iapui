import { Badge, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

const colors = {
  ACTIVE:
    'bg-emerald-100/30 text-emerald-900 dark:text-emerald-200 border-emerald-200',
  CALCULATION:
    'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
  CLINIC:
    'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200',
  DISPLAY: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  HOSPITAL: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  INACTIVE: 'bg-gray-100/30 text-gray-900 dark:text-gray-200 border-gray-200',
  PENDING:
    'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  PRELIMINARY: 'bg-sky-100/30 text-sky-900 dark:text-sky-200 border-sky-200',
  SECONDARY:
    'bg-indigo-100/30 text-indigo-900 dark:text-indigo-200 border-indigo-200',
  SUSPENDED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  SURGERY_CENTER:
    'bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200',
} as const

export function AssessmentPromptEnumBadge(props: {
  presentation?: 'table' | 'view'
  value: keyof typeof colors | null | undefined
  translationKey: string | undefined
}) {
  const { presentation = 'table', value, translationKey } = props
  const { t } = useTranslate()
  return value && translationKey ? (
    <Badge
      className={cn(
        presentation === 'table' && 'capitalize',
        'w-fit overflow-hidden',
        colors[value]
      )}
      variant='outline'
    >
      {t(translationKey as never)}
    </Badge>
  ) : (
    <p className='text-sm text-muted-foreground'>{t('common.notAvailable')}</p>
  )
}
