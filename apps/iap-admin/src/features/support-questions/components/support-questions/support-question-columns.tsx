import { type SupportQuestion } from '@iap/api-types'
import { Badge, cn } from '@iap/ui'
import { TwoLineCell, TwoLineCellWrapper, TwoLineHeader } from '@shared/tables'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import {
  PARTY_ROLE_TRANSLATION_KEYS,
  type PartyRole,
  partyRoleColors,
  supportQuestionStatusColors,
} from '../../constants/support-question-constant'
import { SupportQuestionRowActions } from './support-question-row-actions'

export const useSupportQuestionColumns = (): ColumnDef<SupportQuestion>[] => {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('supportQuestions.columns.title')}
          secondary={t('supportQuestions.columns.key')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={row.original.title}
          secondary={row.original.questionKey}
          longText
        />
      ),
      meta: { className: 'max-w-64' },
    },
    {
      accessorKey: 'level',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('supportQuestions.columns.level')}
          secondary={t('supportQuestions.columns.nextSelectableQuestionKeys')}
        />
      ),
      cell: ({ row }) => (
        <TwoLineCell
          primary={row.original.level}
          secondary={
            row.original.nextSelectableQuestionKeys?.join(', ') || undefined
          }
          longTextSecondary
        />
      ),
      enableSorting: false,
      meta: { className: 'max-w-64' },
    },
    {
      accessorKey: 'requiredParam',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('supportQuestions.columns.requiredParam')}
          secondary={t('supportQuestions.columns.requiredParamInputDisplay')}
        />
      ),
      cell: ({ row }) => {
        const inputDisplay = row.original.requiredParamInputDisplay

        return (
          <TwoLineCell
            primary={row.original.requiredParam}
            secondary={
              inputDisplay
                ? t(`supportQuestions.inputDisplay.${inputDisplay}` as never)
                : undefined
            }
            longTextPrimary
          />
        )
      },
      enableSorting: false,
      meta: { className: 'max-w-48' },
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('supportQuestions.columns.status')}
          secondary={t('supportQuestions.columns.sequence')}
        />
      ),
      cell: ({ row }) => {
        const statusKey = row.original.active === false ? 'inactive' : 'active'

        return (
          <TwoLineCellWrapper>
            {[
              <Badge
                key={statusKey}
                variant='outline'
                className={cn(
                  'w-fit capitalize',
                  supportQuestionStatusColors[statusKey]
                )}
              >
                {t(`supportQuestions.status.${statusKey}` as never)}
              </Badge>,
              row.original.sequence ?? '-',
            ]}
          </TwoLineCellWrapper>
        )
      },
      enableSorting: false,
    },
    {
      id: 'roles',
      accessorFn: (row) => row.roles ?? [],
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('supportQuestions.columns.roles')}
        />
      ),
      cell: ({ row }) => {
        const roles = row.getValue('roles') as PartyRole[]

        if (!roles.length) {
          return <div className='text-sm text-muted-foreground'>-</div>
        }

        return (
          <div className='flex max-w-80 flex-wrap gap-1'>
            {roles.map((role) => (
              <Badge
                key={role}
                variant='outline'
                className={cn('text-xs', partyRoleColors[role])}
              >
                {t(PARTY_ROLE_TRANSLATION_KEYS[role] as never)}
              </Badge>
            ))}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => <SupportQuestionRowActions row={row} />,
      meta: { className: 'sticky left-0 bg-background w-30' },
    },
  ]
}
