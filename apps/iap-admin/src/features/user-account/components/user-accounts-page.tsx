import { useCallback } from 'react'

import { PartyFormDialog } from '@features/user-account/components/party-form-dialog'
import { PartyUserAccountDialog } from '@features/user-account/components/party-user-account-dialog'
import { useUserAccountColumns } from '@features/user-account/components/user-account-columns'
import { UserAccountDialogs } from '@features/user-account/components/user-account-dialogs'
import { UserAccountToolbar } from '@features/user-account/components/user-account-toolbar'
import { UserAccountProvider } from '@features/user-account/context/provider/user-account-provider'
import { useUserAccountStore } from '@features/user-account/context/store/user-account-store'
import { userAccountService } from '@features/user-account/services/user-account-service'
import type { UserAccount } from '@iap/api-types'
import { isAdminRole, useAuthSession } from '@iap/auth'
import { Button, Permission, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  parseTableFilterSearch,
  toTableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'

const EMPTY_USER_ACCOUNTS: UserAccount[] = []

function UserAccountsContent() {
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const openDialog = useUserAccountStore((state) => state.openDialog)
  const tableState = useTableFilterQueryParams({
    parse: parseTableFilterSearch,
    search,
    serialize: toTableFilterSearch,
  })
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
  const users = query.data?.content ?? EMPTY_USER_ACCOUNTS
  const { refetch } = query
  const refresh = useCallback(() => void refetch(), [refetch])
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
            <Permission hasPermission={canManage}>
              <Button onClick={() => openDialog('create')}>
                <Plus aria-hidden='true' className='size-4' />
                {t('parties.create')}
              </Button>
            </Permission>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <UserAccountToolbar />
          <PaginatedDataTable<UserAccount>
            columns={columns}
            data={users}
            enableSorting={false}
            hasActiveFilters={Object.keys(tableState.filters).length > 0}
            isLoading={query.isLoading}
            labels={{
              empty: t('parties.noParties'),
              loading: t('common.loading'),
            }}
            onPaginationChange={tableState.onPaginationChange}
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
