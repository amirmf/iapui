import { useCallback, useMemo } from 'react'

import { isAdminRole, useAuthSession } from '@iap/auth'
import { Button, cn } from '@iap/ui'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  parseTableFilterSearch,
  toTableFilterSearch,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { PaginationState, Updater } from '@tanstack/react-table'
import { Plus, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useUserAccountStore } from '../model/user-account-store'
import { userAccountService } from '../services/user-account-service'
import { PartyFormDialog } from './party-form-dialog'
import { PartyUserAccountDialog } from './party-user-account-dialog'
import { useUserAccountColumns } from './user-account-columns'
import { UserAccountDialogs } from './user-account-dialogs'
import { UserAccountProvider } from './user-account-provider'
import { UserAccountToolbar } from './user-account-toolbar'

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

function toSearchRecord(value: Record<string, unknown>): TableFilterSearch {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, item]) => typeof item === 'string' || Array.isArray(item)
    )
  ) as TableFilterSearch
}

function UserAccountsContent() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const router = useRouter()
  const openDialog = useUserAccountStore((state) => state.openDialog)
  const tableState = parseTableFilterSearch(
    toSearchRecord(router.state.location.search as Record<string, unknown>)
  )
  const query = useQuery({
    queryFn: ({ signal }) =>
      userAccountService.getPageFull({
        filters: Object.fromEntries(
          Object.entries(tableState.filters).filter(
            ([, value]) => value !== undefined
          )
        ) as Record<string, string | string[]>,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['user-account', tableState.pagination, tableState.filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const columns = useUserAccountColumns()
  const users = useMemo(() => query.data?.content ?? [], [query.data])
  const changePage = useCallback(
    (updater: Updater<PaginationState>) => {
      const pagination = resolveUpdater(updater, tableState.pagination)
      router.navigate({
        replace: true,
        search: toTableFilterSearch({ ...tableState, pagination }) as never,
        to: './',
      })
    },
    [router, tableState]
  )
  const refresh = useCallback(() => void query.refetch(), [query])
  const canManage = isAdminRole(user?.roles ?? [])

  return (
    <>
      <div className='pb-4'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('parties.title')}
          </h2>
          <div className='flex gap-2'>
            <Button
              disabled={query.isLoading}
              onClick={refresh}
              variant='outline'
            >
              <RefreshCw
                aria-hidden='true'
                className={cn('size-4', query.isLoading && 'animate-spin')}
              />
              {t('parties.refresh')}
            </Button>
            {canManage ? (
              <Button onClick={() => openDialog('create')}>
                <Plus aria-hidden='true' className='size-4' />
                {t('parties.create')}
              </Button>
            ) : null}
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <UserAccountToolbar />
          <PaginatedDataTable
            columns={columns}
            data={users}
            enableSorting={false}
            hasActiveFilters={Object.keys(tableState.filters).length > 0}
            isLoading={query.isLoading}
            labels={{
              empty: t('parties.noParties'),
              loading: t('common.loading'),
            }}
            onPaginationChange={changePage}
            pageCount={query.data?.totalPages ?? 0}
            pagination={tableState.pagination}
            tableWrapperClassName='max-h-140'
            totalCount={query.data?.totalElements ?? 0}
          />
        </div>
      </div>
      <PartyFormDialog onSuccess={refresh} />
      <PartyUserAccountDialog onSuccess={refresh} />
      <UserAccountDialogs onSuccess={refresh} />
    </>
  )
}

export function UserAccountsPage() {
  return (
    <UserAccountProvider>
      <UserAccountsContent />
    </UserAccountProvider>
  )
}
