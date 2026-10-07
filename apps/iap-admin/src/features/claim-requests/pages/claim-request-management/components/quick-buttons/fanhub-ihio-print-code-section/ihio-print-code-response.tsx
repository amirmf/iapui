import { useMemo } from 'react'

import fanhubTaminService from '@features/claim-requests/pages/claim-request-management/services/fanhub-tamin-service'
import type {
  FanhubIhioInsuredInfo,
  FanhubIhioPrescriptionInfo,
} from '@iap/api-types'
import { Alert, AlertDescription, AlertTitle } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { DataTableColumnHeader, SimpleDataTable } from '@shared/tables'
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

const displayValue = (value: unknown) =>
  value === null || value === undefined || value === '' ? '-' : String(value)
type IhioPrintCodeResponseProps = {
  data:
    | Awaited<
        ReturnType<
          typeof fanhubTaminService.inquireIhioPrescriptionsByPrintCode
        >
      >
    | undefined
  error: Error | null
  isError: boolean
}

export function IhioPrintCodeResponse(props: IhioPrintCodeResponseProps) {
  const { data, error, isError } = props
  const { t } = useTranslation()
  const response = data?.result?.data
  const insuredInfo = response?.info?.insuredInfo
  const prescriptions = response?.info?.prescriptionInfo ?? []
  const columns = useMemo<ColumnDef<FanhubIhioPrescriptionInfo, unknown>[]>(
    () =>
      [
        'creationDate',
        'partnerName',
        'contractPartyName',
        'licenseName',
        'samadCode',
        'isActive',
      ].map((field) => ({
        id: field,
        accessorFn: (prescription) =>
          displayValue(prescription[field as keyof FanhubIhioPrescriptionInfo]),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t(`claimRequests.ihioPrintCode.fields.${field}` as never)}
          />
        ),
        cell: ({ row }) => row.getValue(field),
      })),
    [t]
  )
  const table = useReactTable({
    data: prescriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isError) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>{t('errors.general.heading')}</AlertTitle>
        <AlertDescription>
          {error?.message ?? t('errors.general.description')}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  return (
    <div className='min-w-0 space-y-4'>
      <p className='text-sm text-muted-foreground'>
        {response?.resMessage ??
          data.result?.status?.message ??
          data.status?.message}
      </p>
      <InsuredInfo insuredInfo={insuredInfo} />
      <SimpleDataTable
        presentation='reference'
        table={table}
        emptyStateText={t('claimRequests.ihioPrintCode.empty')}
        tableWrapperClassName='w-full min-w-0 max-w-full overflow-x-auto rounded-md border'
      />
    </div>
  )
}

function InsuredInfo(props: {
  insuredInfo: FanhubIhioInsuredInfo | undefined
}) {
  const { insuredInfo } = props
  const { t } = useTranslation()

  if (!insuredInfo) return null

  const fields = [
    'name',
    'lastName',
    'nationalNumber',
    'birthDate',
    'gender',
    'isCovered',
  ] as const

  return (
    <dl className='grid grid-cols-1 gap-x-4 gap-y-2 rounded-md border bg-muted/30 p-3 text-sm sm:grid-cols-2 lg:grid-cols-3'>
      {fields.map((field) => (
        <div key={field} className='min-w-0'>
          <dt className='text-muted-foreground'>
            {t(`claimRequests.ihioPrintCode.fields.${field}` as never)}
          </dt>
          <dd className='truncate font-medium'>
            {displayValue(insuredInfo[field])}
          </dd>
        </div>
      ))}
    </dl>
  )
}
