import { useEffect, useMemo } from 'react'

import type { SubUser, UserAccount } from '@iap/api-types'
import { Button } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useSubUser } from '../context/store/sub-user-store'
import { useSubUsersPageQuery } from '../queries/use-sub-users-query'
import { useSubUserTableState } from '../route-adapters/use-sub-user-table-state'
import { useSubUserColumns } from './sub-user-columns'
import { SubUsersDataTableToolbar } from './sub-users-data-table-toolbar'

export function SubUserSection() {
  const { t } = useTranslation()
  const { filters, pagination, setPagination } = useSubUserTableState()

  const setOpen = useSubUser((state) => state.setOpen)
  const setCurrentRow = useSubUser((state) => state.setCurrentRow)
  const rowSelection = useSubUser((state) => state.rowSelection)
  const setRowSelection = useSubUser((state) => state.setRowSelection)
  const setSelectedUserAccount = useSubUser(
    (state) => state.setSelectedUserAccount
  )

  const {
    data: subUsersPage,
    isFetching,
    isLoading,
    refetch,
  } = useSubUsersPageQuery({
    filters,
    pagination,
  })

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])

  const columns = useSubUserColumns()

  const subUsers = useMemo<SubUser[]>(
    () => subUsersPage?.content ?? [],
    [subUsersPage?.content]
  )

  const pageCount = Math.max(1, subUsersPage?.totalPages ?? 1)
  const totalCount = subUsersPage?.totalElements ?? 0

  const selectedUserAccount = useMemo<UserAccount[]>(() => {
    const result: UserAccount[] = []
    const selectedIndices = Object.keys(rowSelection)
      .map(Number)
      .filter((index) => rowSelection[index])

    for (const index of selectedIndices) {
      const tmp = subUsers[index]
      if (tmp) {
        result.push({
          displayName: tmp.displayName ?? null,
          id: tmp.id,
          mobileNumber: tmp.mobileNumber ?? null,
          username: tmp.username,
        })
      }
    }
    return result
  }, [rowSelection, subUsers])

  useEffect(() => {
    setSelectedUserAccount(selectedUserAccount)
  }, [selectedUserAccount, setSelectedUserAccount])

  return (
    <Main className='sm:px-4 sm:py-4'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('subUsers.title')}
        </h2>
        <div className='flex items-center gap-2'>
          <Button
            disabled={isLoading || isFetching}
            onClick={() => refetch()}
            variant='outline'
          >
            <IconRefresh
              className={`mr-2 size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            {t('subUsers.actions.refresh')}
          </Button>
          <Button
            onClick={() => {
              setCurrentRow(null)
              setOpen('editor')
            }}
          >
            <IconPlus className='mr-2 size-4' />
            {t('subUsers.actions.create')}
          </Button>
        </div>
      </div>

      <SubUsersDataTableToolbar />
      <PaginatedDataTable
        columns={columns}
        data={subUsers}
        emptyStateText={t('subUsers.empty')}
        hasCheckboxes
        isLoading={isLoading}
        onPaginationChange={setPagination}
        onRowSelectionChange={setRowSelection}
        pageCount={pageCount}
        pagination={pagination}
        rowSelection={rowSelection}
        smallPagination
        tableWrapperClassName='max-h-90'
        totalCount={totalCount}
      />
    </Main>
  )
}

export default SubUserSection
