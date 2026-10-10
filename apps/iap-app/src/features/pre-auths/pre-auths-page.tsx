import { useCallback, useEffect, useState } from 'react'

import { ConfirmDialog } from '@iap/dialogs'
import { Alert, AlertDescription, AlertTitle, Button } from '@iap/ui'
import { RotateCwIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MyClaimRequestPageHeader } from './components/my-claim-request-page-header'
import { Pagination } from './components/pagination'
import { PreAuthCard } from './components/pre-auth-card'
import {
  PreAuthFilter,
  type PreAuthFilterValues,
} from './components/pre-auth-filter'
import { usePreAuths } from './queries/use-pre-auths'

const PAGE_SIZE = 9

export function PreAuthsPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState<PreAuthFilterValues | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const request = filters ? { ...filters, page, size: PAGE_SIZE } : null
  const {
    data: pageData,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = usePreAuths(request)

  const preAuths = pageData?.content ?? []
  const hasNextPage = preAuths.length === PAGE_SIZE

  // If the user navigates to a page > 0 but the server returns an
  // empty content (for example because items were removed), automatically
  // step back to the previous page and let the query refetch. This keeps
  // the user on a valid page with data instead of showing an empty state.
  useEffect(() => {
    if (
      filters &&
      page > 0 &&
      pageData &&
      Array.isArray(pageData.content) &&
      pageData.content.length === 0 &&
      !isLoading &&
      !isFetching
    ) {
      // Ask the user before stepping back to the previous page.
      setConfirmOpen(true)
    }
    // Intentionally include the query state and pagination inputs so the
    // effect runs when new results arrive or the page/filters change.
  }, [
    pageData,
    pageData?.content?.length,
    filters,
    page,
    isLoading,
    isFetching,
  ])

  const handleApply = useCallback((values: PreAuthFilterValues) => {
    setFilters(values)
    setPage(0)
  }, [])

  const handleClear = useCallback(() => {
    setFilters(null)
    setPage(0)
  }, [])

  return (
    <div className='container flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8'>
      <div className='flex flex-1 flex-col space-y-6'>
        <MyClaimRequestPageHeader
          actions={
            <Button
              className='gap-2'
              disabled={!filters || isLoading || isFetching}
              onClick={() => void refetch()}
              variant='outline'
            >
              <RotateCwIcon
                className={isFetching ? 'size-4 animate-spin' : 'size-4'}
              />
              <span>{t('myiap.preAuths.refresh')}</span>
            </Button>
          }
          description={t('myiap.preAuths.description')}
          title={t('myiap.preAuths.title')}
        />

        <PreAuthFilter onApply={handleApply} onClear={handleClear} />

        {isError ? (
          <Alert variant='destructive'>
            <AlertTitle>{t('errors.general.heading')}</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : t('errors.general.description')}
            </AlertDescription>
          </Alert>
        ) : null}

        {!filters ? (
          <div className='flex grow items-center justify-center py-16 text-center'>
            <p className='text-sm text-muted-foreground'>
              {t('myiap.preAuths.selectFilters')}
            </p>
          </div>
        ) : isLoading ? (
          <div className='flex items-center justify-center py-12 text-sm text-muted-foreground'>
            {t('common.loading')}
          </div>
        ) : preAuths.length > 0 ? (
          <div className='flex flex-1 flex-col justify-between space-y-4'>
            <Pagination
              className='border-b pb-4'
              countTranslationKey='myiap.preAuths.pagination'
              currentPage={page}
              hasNextPage={hasNextPage}
              isLoading={isFetching}
              onPageChange={setPage}
            />

            <div className='-mx-2 flex flex-wrap'>
              {preAuths.map((preAuth, index) => (
                <div
                  className='mb-4 w-full px-2 md:w-1/2 lg:w-1/3'
                  key={preAuth.id ?? `pre-auth-${index}`}
                >
                  <PreAuthCard preAuth={preAuth} />
                </div>
              ))}
            </div>

            <Pagination
              className='border-t pt-4'
              countTranslationKey='myiap.preAuths.pagination'
              currentPage={page}
              hasNextPage={hasNextPage}
              isLoading={isFetching}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <div className='flex grow items-center justify-center py-16'>
            <div className='space-y-2 text-center'>
              <p className='text-lg text-muted-foreground'>
                {t('myiap.preAuths.empty')}
              </p>
              <p className='text-sm text-muted-foreground'>
                {t('myiap.preAuths.emptyDescription')}
              </p>
            </div>
          </div>
        )}

        <ConfirmDialog
          description={t('myiap.preAuths.endOfListDialog.desc')}
          hideCancelButton
          onConfirm={() => {
            setPage((p) => Math.max(0, p - 1))
            setConfirmOpen(false)
          }}
          onOpenChange={(open) => setConfirmOpen(open)}
          open={confirmOpen}
          title={t('myiap.preAuths.endOfListDialog.title')}
        />
      </div>
    </div>
  )
}

export default PreAuthsPage
