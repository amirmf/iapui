import { useState } from 'react'

import { MyClaimRequestDeleteDialog } from '@features/my-claims/components/my-claim-request-delete-dialog'
import { MyClaimRequestPageActions } from '@features/my-claims/components/my-claim-request-page-actions'
import { MyClaimRequestPageHeader } from '@features/my-claims/components/my-claim-request-page-header'
import MyClaimRequestsAlert from '@features/my-claims/components/my-claim-requests-alert.tsx'
import {
  MyClaimRequestsFilter,
  type MyClaimRequestsFilterValues,
} from '@features/my-claims/components/my-claim-requests-filter'
import { MyClaimRequestsResults } from '@features/my-claims/components/my-claim-requests-results'
import MyClaimRequestProvider from '@features/my-claims/context/provider/my-claim-request-provider'
import { myClaimRequestsQueryOptions } from '@features/my-claims/queries/my-claim-requests-query'
import { Alert, AlertDescription, AlertTitle } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

function MyClaimRequestsPageContent() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState<MyClaimRequestsFilterValues>({})

  const {
    data: pageData,
    error,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(myClaimRequestsQueryOptions(page, filters))

  const claimRequests = pageData?.content ?? []
  const totalPages = pageData?.totalPages ?? 0
  const totalElements = pageData?.totalElements ?? 0

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0
    }

    return Boolean(value)
  })

  const handleFilterChange = (newFilters: MyClaimRequestsFilterValues) => {
    setFilters(newFilters)
    setPage(0) // Reset to first page when filters change
  }

  return (
    <div className='container flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8'>
      <MyClaimRequestsAlert />
      <div className='flex flex-1 flex-col space-y-6'>
        <MyClaimRequestDeleteDialog refetch={refetch} />
        <MyClaimRequestPageHeader
          title={t('myiap.claimRequests.title', {
            defaultValue: 'My Claim Requests',
          })}
          description={t('myiap.claimRequests.description', {
            defaultValue: 'Review your submitted insurance claim requests.',
          })}
          actions={
            <MyClaimRequestPageActions
              isLoading={isLoading}
              isFetching={isFetching}
              refetch={refetch}
            />
          }
        />

        <MyClaimRequestsFilter
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />

        {isError && (
          <Alert variant='destructive'>
            <AlertTitle>{t('errors.general.heading')}</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : t('errors.general.description')}
            </AlertDescription>
          </Alert>
        )}

        <MyClaimRequestsResults
          claimRequests={claimRequests}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          setPage={setPage}
          isLoading={isLoading}
          isFetching={isFetching}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  )
}

export default function MyClaimRequestsPage() {
  return (
    <MyClaimRequestProvider>
      <MyClaimRequestsPageContent />
    </MyClaimRequestProvider>
  )
}
