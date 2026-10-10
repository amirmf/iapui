import { Button, cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

export interface PaginationProps {
  className?: string
  countTranslationKey?:
    'myClaimRequests.pagination' | 'myiap.preAuths.pagination'
  currentPage: number
  hasNextPage?: boolean
  isLoading?: boolean
  onPageChange: (page: number) => void
  totalElements?: number
  totalPages?: number
}

export function Pagination({
  className,
  countTranslationKey = 'myClaimRequests.pagination',
  currentPage,
  hasNextPage,
  isLoading = false,
  onPageChange,
  totalElements,
  totalPages,
}: PaginationProps) {
  const { t } = useTranslation()

  const hasPreviousPage = currentPage > 0
  const canGoToNextPage =
    hasNextPage ?? (totalPages !== undefined && currentPage < totalPages - 1)

  if (
    totalPages !== undefined
      ? totalPages <= 1
      : !hasPreviousPage && !canGoToNextPage
  ) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4',
        className
      )}
    >
      {totalElements !== undefined ? (
        <div className='text-sm text-muted-foreground'>
          {t(countTranslationKey, {
            count: totalElements,
          })}
        </div>
      ) : null}
      <div
        className={cn(
          'flex items-center gap-2',
          totalElements === undefined && 'ms-auto'
        )}
      >
        <Button
          disabled={!hasPreviousPage || isLoading}
          onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
          variant='outline'
        >
          {t('myClaimRequests.previous')}
        </Button>
        {totalPages !== undefined ? (
          <span className='text-sm text-muted-foreground'>
            {t('myClaimRequests.pageIndicator', {
              defaultValue: 'Page {{page}} of {{total}}',
              page: currentPage + 1,
              total: totalPages,
            })}
          </span>
        ) : null}
        <Button
          disabled={!canGoToNextPage || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          variant='outline'
        >
          {t('myClaimRequests.next', { defaultValue: 'Next' })}
        </Button>
      </div>
    </div>
  )
}
