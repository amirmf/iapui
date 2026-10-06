import { useCallback, useEffect, useState } from 'react'

import { useAgreementCoverageApplColumns } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-columns'
import { AgreementCoverageApplDeleteMethodDialog } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-delete-method-dialog'
import { AgreementCoverageApplFormDialog } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-form-dialog'
import { AgreementCoverageApplViewDialog } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appl-view-dialog'
import { AgreementCoverageDataTableToolbar } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-data-table-toolbar'
import { AgreementCoverageApplProvider } from '@features/agreements/context/provider/agreement-coverage-appl-provider'
import { useAgreementCoverageAppl } from '@features/agreements/context/store/agreement-coverage-appl-store'
import { agreementCoverageApplService } from '@features/agreements/services/agreement-coverage-appl-service'
import type { AgreementCoverageApplFull } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Button, Input, TableCell, TableRow, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { PaginatedDataTable, useTableFilterState } from '@shared/tables'
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type Row,
  type RowSelectionState,
  flexRender,
} from '@tanstack/react-table'
import { toast } from 'sonner'

const EMPTY_APPLS: AgreementCoverageApplFull[] = []

function AgreementCoverageApplsSectionContent(props: SectionContentProps) {
  const { agreementId } = props
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const isSuperAdmin = isSuperAdminRole(user?.roles ?? [])
  const queryClient = useQueryClient()
  const open = useAgreementCoverageAppl((state) => state.open)
  const setOpen = useAgreementCoverageAppl((state) => state.setOpen)
  const currentRow = useAgreementCoverageAppl((state) => state.currentRow)
  const setCurrentRow = useAgreementCoverageAppl((state) => state.setCurrentRow)
  const inlineEditRow = useAgreementCoverageAppl((state) => state.inlineEditRow)
  const setInlineEditRow = useAgreementCoverageAppl(
    (state) => state.setInlineEditRow
  )
  const columns = useAgreementCoverageApplColumns()
  const { filters, pagination, setPagination, reset, setFilters } =
    useTableFilterState({ agreementId: agreementId ?? undefined })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const handleOnReset = useCallback(() => {
    reset({ agreementId: agreementId ?? undefined })
  }, [agreementId, reset])

  useEffect(() => {
    handleOnReset()
  }, [handleOnReset])

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, filters])

  const {
    data: pageData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['agreement-coverage-appls', pagination, filters],
    queryFn: () =>
      agreementCoverageApplService.getPage({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        filters,
      }),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })

  const appls = pageData?.content ?? EMPTY_APPLS
  const pageCount = pageData?.totalPages ?? 0
  const totalCount = pageData?.totalElements ?? 0

  const handleRefresh = () => {
    refetch()
  }

  const handleOpenDeleteMethod = () => {
    if (Object.keys(rowSelection).length > 0) {
      setOpen('deleteMethod')
    }
  }

  const [inlineEditValues, setInlineEditValues] = useState<{
    overrideRatio: string
    franchisePercentage: string
    coverageAmount: string
    amountPerCase: string
  } | null>(null)

  useEffect(() => {
    if (inlineEditRow) {
      setInlineEditValues({
        overrideRatio:
          inlineEditRow.overrideRatio === null ||
          inlineEditRow.overrideRatio === undefined
            ? ''
            : String(inlineEditRow.overrideRatio),
        franchisePercentage:
          inlineEditRow.franchisePercentage === null ||
          inlineEditRow.franchisePercentage === undefined
            ? ''
            : String(inlineEditRow.franchisePercentage),
        coverageAmount:
          inlineEditRow.coverageAmount === null ||
          inlineEditRow.coverageAmount === undefined
            ? ''
            : String(inlineEditRow.coverageAmount),
        amountPerCase:
          inlineEditRow.amountPerCase === null ||
          inlineEditRow.amountPerCase === undefined
            ? ''
            : String(inlineEditRow.amountPerCase),
      })
    } else {
      setInlineEditValues(null)
    }
  }, [inlineEditRow])

  useEffect(() => {
    if (!inlineEditRow) return

    const stillVisible = appls.some((appl) => appl.id === inlineEditRow.id)
    if (!stillVisible) {
      setInlineEditRow(null)
    }
  }, [appls, inlineEditRow, setInlineEditRow])

  const parseNumberValue = (value: string): number | undefined => {
    if (value === '') return undefined
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  const inlineEditMutation = useMutation({
    mutationFn: async () => {
      if (
        !inlineEditRow?.id ||
        !inlineEditRow.agreementId ||
        !inlineEditRow.coverageDetailId ||
        !inlineEditRow.coverageGroupId ||
        !inlineEditRow.damageCodeId
      ) {
        throw new Error('Missing required fields')
      }

      return agreementCoverageApplService.update(inlineEditRow.id, {
        agreementId: inlineEditRow.agreementId,
        coverageDetailId: inlineEditRow.coverageDetailId,
        coverageGroupId: inlineEditRow.coverageGroupId,
        damageCodeId: inlineEditRow.damageCodeId,
        overrideRatio: parseNumberValue(inlineEditValues?.overrideRatio ?? ''),
        franchisePercentage: parseNumberValue(
          inlineEditValues?.franchisePercentage ?? ''
        ),
        coverageAmount: parseNumberValue(
          inlineEditValues?.coverageAmount ?? ''
        ),
        amountPerCase: parseNumberValue(inlineEditValues?.amountPerCase ?? ''),
        fromDate: inlineEditRow.fromDate
          ? new Date(inlineEditRow.fromDate)
          : undefined,
        thruDate: inlineEditRow.thruDate
          ? new Date(inlineEditRow.thruDate)
          : undefined,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['agreement-coverage-appls'],
      })
      toast.success(t('agreementCoverageAppls.messages.updated'))
      setInlineEditRow(null)
    },
  })

  const isInlineSaving = inlineEditMutation.isPending

  const handleInlineValueChange = useCallback(
    (
      field:
        | 'overrideRatio'
        | 'franchisePercentage'
        | 'coverageAmount'
        | 'amountPerCase',
      value: string
    ) => {
      setInlineEditValues((prev) => ({
        ...(prev ?? {
          coverageAmount: '',
          amountPerCase: '',
          franchisePercentage: '',
          overrideRatio: '',
        }),
        [field]: value,
      }))
    },
    []
  )

  const handleInlineCancel = useCallback(() => {
    if (isInlineSaving) return
    setInlineEditRow(null)
  }, [isInlineSaving, setInlineEditRow])

  const handleInlineSave = useCallback(() => {
    inlineEditMutation.mutate()
  }, [inlineEditMutation])

  const renderRow = useCallback(
    (row: Row<AgreementCoverageApplFull>) => {
      if (
        !inlineEditRow ||
        !inlineEditValues ||
        row.original.id !== inlineEditRow.id
      ) {
        return null
      }

      return (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row'
        >
          {row.getVisibleCells().map((cell) => {
            if (
              cell.column.id === 'overrideRatio' ||
              cell.column.id === 'franchisePercentage' ||
              cell.column.id === 'coverageAmount' ||
              cell.column.id === 'amountPerCase'
            ) {
              const value =
                inlineEditValues[
                  cell.column.id as keyof typeof inlineEditValues
                ] ?? ''
              return (
                <TableCell
                  key={cell.id}
                  className={cell.column.columnDef.meta?.className}
                >
                  <Input
                    type='number'
                    step='any'
                    value={value}
                    disabled={isInlineSaving}
                    onChange={(event) =>
                      handleInlineValueChange(
                        cell.column.id as
                          | 'overrideRatio'
                          | 'franchisePercentage'
                          | 'coverageAmount'
                          | 'amountPerCase',
                        event.target.value
                      )
                    }
                  />
                </TableCell>
              )
            }

            if (cell.column.id === 'actions') {
              return (
                <TableCell
                  key={cell.id}
                  className={cell.column.columnDef.meta?.className}
                >
                  <div className='flex justify-end gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={handleInlineCancel}
                      disabled={isInlineSaving}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      size='sm'
                      onClick={handleInlineSave}
                      disabled={isInlineSaving}
                    >
                      {isInlineSaving ? t('form.updating') : t('common.save')}
                    </Button>
                  </div>
                </TableCell>
              )
            }

            return (
              <TableCell
                key={cell.id}
                className={cell.column.columnDef.meta?.className}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            )
          })}
        </TableRow>
      )
    },
    [
      handleInlineCancel,
      handleInlineSave,
      inlineEditRow,
      inlineEditValues,
      isInlineSaving,
      handleInlineValueChange,
      t,
    ]
  )

  return (
    <>
      <main className='flex w-full flex-col rounded-[20px] bg-card px-6 py-6 text-foreground shadow-sm peer-[.header-fixed]/header:mt-16 sm:px-8 sm:py-8'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-xl font-bold tracking-tight'>
              {t('agreementCoverageAppls.title')}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {t('agreementCoverageAppls.description')}
            </p>
          </div>
          <div className='flex gap-2'>
            {isSuperAdmin && (
              <Button
                variant='outline'
                onClick={handleOpenDeleteMethod}
                className='space-x-2 text-destructive'
                disabled={Object.keys(rowSelection).length === 0}
              >
                <IconTrash size={18} aria-hidden='true' />
                <span>{t('common.delete')}</span>
              </Button>
            )}
            <Button
              variant='outline'
              onClick={handleRefresh}
              disabled={isLoading}
              className='space-x-2'
            >
              <IconRefresh
                size={18}
                aria-hidden='true'
                className={cn(isLoading && 'animate-spin')}
              />
              <span>{t('agreementCoverageAppls.refresh')}</span>
            </Button>
            <Button
              presentation='reference'
              onClick={() => setOpen('create')}
              className='space-x-2'
            >
              <IconPlus size={18} aria-hidden='true' />
              <span>{t('agreementCoverageAppls.create')}</span>
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <AgreementCoverageDataTableToolbar
            ignoredFilterIds={['agreementId']}
            values={filters}
            onValuesChange={setFilters}
            onReset={handleOnReset}
          />
          <PaginatedDataTable
            presentation='reference'
            columns={columns}
            enableSorting={false}
            data={appls}
            isLoading={isLoading}
            pageCount={pageCount}
            totalCount={totalCount}
            pagination={pagination}
            onPaginationChange={setPagination}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            renderRow={renderRow}
            tableWrapperClassName='max-h-60'
            hasCheckboxes
          />
        </div>
      </main>

      <AgreementCoverageApplFormDialog
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        defaultAgreementId={agreementId ?? undefined}
      />

      <AgreementCoverageApplDeleteMethodDialog
        open={open === 'deleteMethod'}
        onOpenChange={() => {
          setOpen(null)
          setTimeout(() => setRowSelection({}), 500)
        }}
        appls={appls}
        rowSelection={rowSelection}
      />

      {currentRow && (
        <>
          <AgreementCoverageApplFormDialog
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
            defaultAgreementId={agreementId ?? undefined}
          />

          <AgreementCoverageApplViewDialog
            open={open === 'view'}
            onOpenChange={() => {
              setOpen('view')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            appl={currentRow}
          />
        </>
      )}
    </>
  )
}

interface SectionContentProps {
  agreementId?: string | null
}

interface AgreementCoverageApplsSectionProps {
  agreementId?: string | null
}

export function AgreementCoverageApplsSection(
  props: AgreementCoverageApplsSectionProps
) {
  const { agreementId } = props
  return (
    <AgreementCoverageApplProvider>
      <AgreementCoverageApplsSectionContent agreementId={agreementId} />
    </AgreementCoverageApplProvider>
  )
}
