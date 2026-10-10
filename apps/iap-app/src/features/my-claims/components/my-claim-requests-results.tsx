import { MyClaimRequestCard } from '@features/my-claims/components/my-claim-request-card'
import { Pagination } from '@features/my-claims/components/pagination'
import type { ClaimRequest } from '@iap/api-types'
import { Button } from '@iap/ui'
import { IconPlus } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function MyClaimRequestsResults(props: {
  claimRequests: ClaimRequest[]
  page: number
  totalPages: number
  totalElements: number
  setPage: (page: number) => void
  isLoading: boolean
  isFetching: boolean
  hasActiveFilters: boolean
}) {
  const {
    claimRequests,
    page,
    totalPages,
    totalElements,
    setPage,
    isLoading,
    isFetching,
    hasActiveFilters,
  } = props
  const { t } = useTranslation()
  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center py-12 text-sm text-muted-foreground'>
          {t('common.loading')}
        </div>
      ) : claimRequests.length > 0 ? (
        <div className='flex flex-1 flex-col justify-between space-y-4'>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setPage}
            isLoading={isFetching}
            className='border-b pb-4'
          />

          <div className='-mx-2 flex flex-wrap'>
            {claimRequests.map((claim, index) => (
              <div
                key={claim.id ?? `claim-${index}`}
                className='mb-4 w-full px-2 md:w-1/2 lg:w-1/3'
              >
                <MyClaimRequestCard claim={claim} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setPage}
            isLoading={isFetching}
            className='border-t pt-4'
          />
        </div>
      ) : (
        <div className='flex grow items-center justify-center py-16'>
          {hasActiveFilters ? (
            <div className='space-y-2 text-center'>
              <p className='text-lg text-muted-foreground'>
                {t('myiap.claimRequests.noResults')}
              </p>
              <p className='text-sm text-muted-foreground'>
                {t('myiap.claimRequests.noResultsDescription')}
              </p>
            </div>
          ) : (
            <Button
              presentation='reference'
              asChild
              size='lg'
              className='gap-2'
            >
              <Link to='/myclaims/create/'>
                <IconPlus size={20} />
                <span>{t('myiap.claimRequests.emptyAction')}</span>
              </Link>
            </Button>
          )}
        </div>
      )}
    </>
  )
}
