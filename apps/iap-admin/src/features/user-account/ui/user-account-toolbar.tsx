import { useMemo } from 'react'

import {
  getNationalityTypeOptions,
  getPartyRoleOptions,
} from '@features/user-account/constants/user-account-options'
import { UserAccountSearchSelect } from '@modules/user-account-selection'
import { useTranslate } from '@shared/i18n/i18n'
import {
  type TableFilterBaseProps,
  TableFilterQueryParams,
} from '@shared/tables'
import { useLocation, useRouter } from '@tanstack/react-router'

export function UserAccountToolbar() {
  const { t } = useTranslate()
  const textFilters = useMemo<TableFilterBaseProps['textFilters']>(
    () => [
      {
        className: 'lg:w-full',
        id: 'username',
        placeholder: t('parties.userAccount.filters.username'),
        wrapperClassName: 'w-full sm:w-1/4 xl:w-1/5 px-1',
      },
      {
        className: 'lg:w-full',
        id: 'displayName',
        placeholder: t('parties.userAccount.filters.displayName'),
        wrapperClassName: 'w-full sm:w-1/4 xl:w-1/5 px-1',
      },
      {
        className: 'lg:w-full',
        id: 'mobileNumber',
        placeholder: t('parties.userAccount.filters.mobileNumber'),
        wrapperClassName: 'w-full sm:w-1/4 xl:w-1/5 px-1',
      },
      {
        className: 'lg:w-full',
        id: 'extContractId',
        numerical: true,
        placeholder: t('parties.userAccount.filters.extContractId'),
        wrapperClassName: 'w-full sm:w-1/4 xl:w-1/5 px-1',
      },
    ],
    [t]
  )
  const facetedFilters = useMemo<TableFilterBaseProps['facetedFilters']>(
    () => [
      {
        className: 'mx-1',
        id: 'roles.name',
        options: getPartyRoleOptions(t),
        title: t('parties.userAccount.filters.roles'),
      },
      {
        className: 'mx-1',
        id: 'nationalityType',
        multiple: false,
        options: getNationalityTypeOptions(t),
        title: t('parties.userAccount.filters.nationalityType'),
      },
    ],
    [t]
  )
  return (
    <TableFilterQueryParams
      facetedFilters={facetedFilters}
      showReset
      textFilters={textFilters}
    >
      <ParentUserAccountFilter />
    </TableFilterQueryParams>
  )
}

function ParentUserAccountFilter() {
  const { t } = useTranslate()
  const location = useLocation()
  const router = useRouter()
  const value = (location.search as Record<string, unknown>).parentUserAccountId

  return (
    <div className='w-full px-1 sm:w-1/4 xl:w-1/5'>
      <UserAccountSearchSelect
        onChange={(nextValue) =>
          router.navigate({
            replace: true,
            search: (previous) => {
              const next = { ...previous } as Record<string, unknown>

              if (nextValue) next.parentUserAccountId = nextValue
              else delete next.parentUserAccountId

              return next as never
            },
            to: './',
          })
        }
        placeholder={t('parties.userAccount.fields.parentUserAccount')}
        value={typeof value === 'string' ? value : undefined}
      />
    </div>
  )
}
