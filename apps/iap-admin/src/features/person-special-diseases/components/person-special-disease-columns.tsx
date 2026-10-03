import { useMemo } from 'react'

import { PersonSpecialDiseaseRowActions } from '@features/person-special-diseases/components/person-special-disease-row-actions'
import type { PersonSpecialDisease } from '@iap/api-types'
import { Badge, cn, formatDateTime } from '@iap/ui'
import {
  specialDiseaseColors,
  specialDiseaseTranslationKeys,
} from '@modules/person-special-diseases'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<PersonSpecialDisease>()

export function usePersonSpecialDiseaseColumns() {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor('nationalCode', {
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('personSpecialDiseases.fields.nationalCode')}
          />
        ),
      }),
      columnHelper.accessor('specialDiseases', {
        cell: (context) => {
          const diseases = context.getValue() ?? []
          if (!diseases.length) return '-'

          return (
            <div className='flex flex-wrap gap-1'>
              {diseases.map((disease) => (
                <Badge
                  className={cn(specialDiseaseColors[disease])}
                  key={`${context.row.original.nationalCode ?? 'unknown'}-${disease}`}
                  variant='outline'
                >
                  {t(specialDiseaseTranslationKeys[disease] as never)}
                </Badge>
              ))}
            </div>
          )
        },
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('personSpecialDiseases.fields.specialDiseases')}
          />
        ),
        id: 'specialDiseases',
      }),
      columnHelper.accessor('createdAt', {
        cell: (context) => formatDateTime(context.getValue()) ?? '-',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('personSpecialDiseases.fields.createdAt')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => <PersonSpecialDiseaseRowActions row={context.row} />,
        id: 'actions',
        meta: { className: 'sticky left-0 w-20 max-w-20 bg-background' },
      }),
    ],
    [t]
  )
}
