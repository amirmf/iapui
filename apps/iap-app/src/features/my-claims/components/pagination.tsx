import { Button, cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  currentPage: number
  totalPages?: number
  totalElements?: number
  hasNextPage?: boolean
  onPageChange: (page: number) => void
  isLoading?: boolean
  className?: string
  countTranslationKey?: 'myClaimRequests.pagination'
}

export function Pagination(props: PaginationProps) {
  const {
    currentPage,
    totalPages,
    totalElements,
    hasNextPage,
    onPageChange,
    isLoading = false,
    className,
    countTranslationKey = 'myClaimRequests.pagination',
  } = props
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
          presentation='reference'
          variant='outline'
          onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
          disabled={!hasPreviousPage || isLoading}
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
          presentation='reference'
          variant='outline'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoToNextPage || isLoading}
        >
          {t('myClaimRequests.next', { defaultValue: 'Next' })}
        </Button>
      </div>
    </div>
  )
}
