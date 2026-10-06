import { useMemo } from 'react'

import { AgreementPartyApplRowActions } from '@features/agreements/components/agreement-party-appls/agreement-party-appl-row-actions'
import { agreementPartyRoleTranslationKeys } from '@features/agreements/constants/agreement-party-role-options'
import type { AgreementPartyApplFull } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<AgreementPartyApplFull>()

export function useAgreementPartyApplColumns() {
  const { t } = useTranslate()
  return useMemo(
    () => [
      columnHelper.accessor(
        (row) =>
          row.userAccount?.displayName ||
          row.userAccount?.username ||
          row.userAccountId,
        {
          id: 'userAccount.displayName',
          cell: (context) => (
            <TwoLineCell
              emptyValue='-'
              longTextPrimary
              primary={context.getValue()}
              secondary={context.row.original.userAccount?.username}
            />
          ),
          header: ({ column }) => (
            <TwoLineHeader
              column={column}
              primary={t('agreements.partyAppls.user' as never)}
              secondary={t('agreements.partyAppls.filters.username' as never)}
            />
          ),
        }
      ),
      columnHelper.accessor('role', {
        cell: (context) => {
          const role = context.getValue()
          return (
            <TwoLineCell
              emptyValue='-'
              longTextSecondary
              primary={
                role ? t(agreementPartyRoleTranslationKeys[role] as never) : '-'
              }
              secondary={context.row.original.agreement?.title}
            />
          )
        },
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('agreements.partyAppls.role' as never)}
            secondary={t('agreements.partyAppls.agreementTitle' as never)}
          />
        ),
        meta: { className: 'max-w-48' },
      }),
      columnHelper.accessor((row) => row.agreement?.extPolicyId ?? null, {
        id: 'agreement.extPolicyId',
        cell: (context) => (
          <TwoLineCell
            emptyValue='-'
            primary={context.getValue()}
            secondary={context.row.original.agreement?.extLocation}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('agreements.columns.extPolicyId' as never)}
            secondary={t('agreements.columns.extLocation' as never)}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => <AgreementPartyApplRowActions row={context.row} />,
        enableSorting: false,
        id: 'actions',
        meta: { className: 'sticky left-0 w-22 max-w-22 bg-background' },
      }),
    ],
    [t]
  )
}
