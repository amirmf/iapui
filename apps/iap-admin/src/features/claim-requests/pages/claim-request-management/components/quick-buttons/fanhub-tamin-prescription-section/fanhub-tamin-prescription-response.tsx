import { useMemo } from 'react'

import { FanhubTaminDrugPrescription } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-tamin-prescription-section/fanhub-tamin-drug-prescription'
import type {
  FanhubDrugPrescription,
  FanhubDrugPrescriptionResponse,
  FanhubOfficeServiceResponse,
  FanhubParaClinicPrescriptionResponse,
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

type InquiryType = 'drug' | 'paraClinic' | 'officeService'
type FanhubPrescriptionResponse =
  | FanhubDrugPrescriptionResponse
  | FanhubParaClinicPrescriptionResponse
  | FanhubOfficeServiceResponse
type FanhubPrescriptionItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<FanhubPrescriptionResponse['result']>['data']
    >['data']
  >['list']
>[number]

const fieldsByType: Record<InquiryType, string[]> = {
  drug: [
    'prescDate',
    'srvName',
    'srvCode',
    'qtyDoc',
    'qtyPha',
    'drgUsg',
    'drgInst',
    'druqAmt',
    'phaPrice',
    'phaRequestPrice',
    'insurancePayment',
    'ssoPayment',
  ],
  paraClinic: [
    'prescDate',
    'srvName',
    'srvCode',
    'rvuCode',
    'tarefPrice',
    'qtyDoc',
    'insurancePayment',
    'ssoPayment',
  ],
  officeService: [
    'prescDate',
    'srvName',
    'srvCode',
    'ciamId',
    'insurancePayment',
    'ssoPayment',
  ],
}

const patientFields = ['patientName', 'patientID', 'docName', 'specDesc']

function displayValue(value: unknown) {
  return value === null || value === undefined || value === ''
    ? '-'
    : String(value)
}

export function FanhubTaminPrescriptionResponse(props: {
  type: InquiryType
  data: FanhubPrescriptionResponse | undefined
  error: Error | null
  isPending: boolean
  isError: boolean
}) {
  const { type, data, error, isPending, isError } = props
  const { t } = useTranslation()
  const responseData = data?.result?.data
  const prescriptions: FanhubPrescriptionItem[] = responseData?.data?.list ?? []
  const fields = useMemo(
    () => [...patientFields, ...fieldsByType[type]],
    [type]
  )
  const responseMessage =
    responseData?.reason ??
    data?.result?.status?.message ??
    data?.status?.message
  const columns = useMemo<ColumnDef<FanhubPrescriptionItem, unknown>[]>(
    () =>
      fields.map((field) => ({
        id: field,
        accessorFn: (prescription) =>
          displayValue(prescription[field as keyof FanhubPrescriptionItem]),
        header: ({ column }) => (
          <DataTableColumnHeader
            presentation='reference'
            column={column}
            title={t(
              `claimRequests.taminPrescriptions.fields.${field}` as never
            )}
          />
        ),
        cell: ({ row }) => row.getValue(field),
      })),
    [fields, t]
  )
  const table = useReactTable({
    data: prescriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      {isError ? (
        <Alert variant='destructive'>
          <AlertTitle>{t('errors.general.heading')}</AlertTitle>
          <AlertDescription>
            {error?.message ?? t('errors.general.description')}
          </AlertDescription>
        </Alert>
      ) : (
        <div className='min-w-0 space-y-3'>
          {type === 'drug' || type === 'paraClinic' ? (
            <FanhubTaminDrugPrescription
              items={prescriptions as FanhubDrugPrescription[]}
              isLoading={isPending}
              emptyMessage={
                responseMessage ||
                t('claimRequests.taminPrescriptions.drugEmpty')
              }
            />
          ) : (
            <SimpleDataTable
              presentation='reference'
              table={table}
              isLoading={isPending}
              loadingText={t('common.loading')}
              emptyStateText={
                responseMessage || t('claimRequests.taminPrescriptions.empty')
              }
              tableWrapperClassName='w-full min-w-0 max-w-full overflow-x-auto rounded-md border'
            />
          )}
        </div>
      )}
    </>
  )
}
