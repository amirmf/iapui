import { useMemo } from 'react'

import { useDamageCasesDialog } from '@features/outpatient-doc-acceptances/context/store/damage-cases-dialog-store'
import type { DmgCase } from '@iap/api-types'
import { Button } from '@iap/ui'
import { SimpleDataTable } from '@shared/tables/data-table/simple-data-table'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const DamageCaseRowActions = (props: { dmgCase: DmgCase }) => {
  const { dmgCase } = props
  const { t } = useTranslation()
  const { selectCase } = useDamageCasesDialog()

  const handleView = () => selectCase({ mode: 'view', dmgCase })
  const handleEdit = () => selectCase({ mode: 'edit', dmgCase })
  const handleDelete = () => selectCase({ mode: 'delete', dmgCase })

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        size='icon'
        onClick={handleView}
        title={t('common.view')}
      >
        <IconEye className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={handleEdit}
        title={t('common.edit')}
      >
        <IconEdit className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={handleDelete}
        title={t('common.delete')}
        className='text-destructive hover:text-destructive'
      >
        <IconTrash className='h-4 w-4' />
      </Button>
    </div>
  )
}

interface DamageCasesTableProps {
  data: DmgCase[]
  isLoading: boolean
}

export const DamageCasesTable = (props: DamageCasesTableProps) => {
  const { data, isLoading } = props
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<DmgCase>[]>(
    () => [
      {
        accessorKey: 'serviceDate',
        header: t('outpatientDocAcceptances.damageCaseFields.serviceDate'),
        cell: ({ row }) => <span>{row.getValue('serviceDate')}</span>,
      },
      {
        accessorKey: 'medicalSystemCode',
        header: t(
          'outpatientDocAcceptances.damageCaseFields.medicalSystemCode'
        ),
        cell: ({ row }) => <span>{row.getValue('medicalSystemCode')}</span>,
      },
      {
        accessorKey: 'requestedAmount',
        header: t('outpatientDocAcceptances.damageCaseFields.requestedAmount'),
        cell: ({ row }) => <span>{row.getValue('requestedAmount')}</span>,
      },
      {
        accessorKey: 'approvedAmount',
        header: t('outpatientDocAcceptances.damageCaseFields.approvedAmount'),
        cell: ({ row }) => <span>{row.getValue('approvedAmount')}</span>,
      },
      {
        accessorKey: 'status',
        header: t('outpatientDocAcceptances.damageCaseFields.status'),
        cell: ({ row }) => (
          <span className='uppercase'>{row.getValue('status')}</span>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => <DamageCaseRowActions dmgCase={row.original} />,
      },
    ],
    [t]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <SimpleDataTable
      presentation='reference'
      labels={{
        loading: t('dataTable.loading', { defaultValue: 'Loading...' }),
        empty: t('dataTable.empty', { defaultValue: 'No data found.' }),
      }}
      table={table}
      isLoading={isLoading}
      renderToolbar={undefined}
      tableWrapperClassName='overflow-hidden rounded-md border'
    />
  )
}
