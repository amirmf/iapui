import type { AssessmentItem } from '@iap/api-types'
import { Card, CardContent, CardHeader, CardTitle, cn } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { assessmentItemService } from '../services/assessment-item-service'

type ReadonlyAssessmentItemsProps = {
  claimRequestId?: string
  enabled: boolean
}

export function ReadonlyAssessmentItems(props: ReadonlyAssessmentItemsProps) {
  const { claimRequestId, enabled } = props
  const { t } = useTranslation()
  const query = useQuery({
    enabled: enabled && Boolean(claimRequestId),
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      assessmentItemService.findByClaimRequest({
        path: { claimRequestId: claimRequestId! },
        signal,
      }),
    queryKey: ['assessmentItems', { claimRequestId }],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

  if (!claimRequestId) {
    return (
      <p className='text-sm text-muted-foreground'>
        {t('tickets.relatedClaimRequest.assessmentItemsUnavailable')}
      </p>
    )
  }

  if (query.isLoading) {
    return (
      <p className='text-sm text-muted-foreground'>
        {t('tickets.relatedClaimRequest.loading')}
      </p>
    )
  }

  if (query.isError) {
    return (
      <p className='text-sm text-destructive' role='alert'>
        {t('tickets.relatedClaimRequest.assessmentItemsError')}
      </p>
    )
  }

  if (!query.data?.length) {
    return (
      <p className='py-12 text-center text-sm text-muted-foreground'>
        {t('assessmentItems.empty')}
      </p>
    )
  }

  return (
    <div className='mb-10 grid grid-cols-1 gap-3'>
      {query.data.map((item) => (
        <ReadonlyAssessmentItemCard
          item={item}
          key={item.id ?? `${item.damageCode?.code}-${item.damageCode?.title}`}
        />
      ))}
    </div>
  )
}

function formatAmount(value: number | null | undefined) {
  return typeof value === 'number' ? value.toLocaleString('en-US') : '-'
}

function ReadonlyAssessmentItemCard(props: { item: AssessmentItem }) {
  const { item } = props
  const { t } = useTranslation()
  const rows = [
    {
      label: t('assessmentItems.dialog.fields.estimatedAmount'),
      value: `${formatAmount(item.estimatedAmount)} (${formatAmount(item.quantity ?? 1)}${t('assessmentItems.quantitySuffix')})`,
    },
    {
      label: t('assessmentItems.dialog.fields.franchizeDeductionAmount'),
      value: formatAmount(item.franchizeDeductionAmount),
      valueClassName: 'text-destructive',
    },
    {
      label: t('assessmentItems.dialog.fields.remainCoverageAmount'),
      value: formatAmount(item.remainCoverageAmount),
    },
    {
      label: t('assessmentItems.dialog.fields.amountPaid'),
      value: formatAmount(item.amount),
      valueClassName: 'font-semibold text-green-600 dark:text-green-400',
    },
    {
      label: t('assessmentItems.dialog.fields.toothNumbers'),
      value:
        item.toothNumber?.toString() ?? item.toothNumbers?.join(', ') ?? '-',
    },
  ]

  return (
    <Card className='h-full w-full gap-3 rounded border-gray-400 py-1 shadow-none'>
      <CardHeader className='border-b px-2 py-1'>
        <CardTitle className='line-clamp-1 text-sm'>
          {item.damageCode?.code ? `${item.damageCode.code}: ` : ''}
          {item.damageCode?.title ?? '-'}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3 px-2'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          {rows.map((row) => (
            <div
              className='flex items-center justify-between gap-1'
              key={row.label}
            >
              <p className='text-sm text-muted-foreground'>{row.label}</p>
              <p
                className={cn(
                  'flex-1 text-left text-sm font-medium tabular-nums',
                  row.valueClassName
                )}
              >
                {row.value}
              </p>
            </div>
          ))}
        </div>
        {item.description ? (
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              {t('assessmentItems.dialog.fields.description')}
            </p>
            <p className='mt-1 whitespace-pre-wrap text-sm'>
              {item.description}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
