import { useCallback } from 'react'

import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { agreementPartyApplService } from '@features/agreements/services/agreement-party-appl-service'
import type { AgreementPartyApplFull } from '@iap/api-types'
import { type DeleteMethod, DeleteMethodDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function AgreementPartyApplDeleteMethodDialog(props: {
  applications: AgreementPartyApplFull[]
}) {
  const { applications } = props
  const { t } = useTranslate()
  const openDialog = useAgreementPartyApplStore((state) => state.openDialog)
  const rowSelection = useAgreementPartyApplStore((state) => state.rowSelection)
  const setCurrentRow = useAgreementPartyApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useAgreementPartyApplStore(
    (state) => state.setOpenDialog
  )
  const setRowSelection = useAgreementPartyApplStore(
    (state) => state.setRowSelection
  )
  const queryClient = useQueryClient()
  const selectedIds = Object.keys(rowSelection).flatMap((rowId) =>
    applications[Number(rowId)]?.id
      ? [applications[Number(rowId)].id as string]
      : []
  )
  const mutation = useMutation({
    mutationFn: async ({
      method,
      thruDate,
    }: {
      method: DeleteMethod
      thruDate?: string
    }) => {
      if (selectedIds.length === 0) throw new Error('No applications selected')
      if (method === 'soft')
        await agreementPartyApplService.softDeletePartyApplicationBulk(
          selectedIds,
          thruDate
        )
      else
        await agreementPartyApplService.bulkDeletePartyApplication(selectedIds)
    },
    onSuccess: (_, { method }) => {
      void queryClient.invalidateQueries({
        queryKey: ['agreement-party-appls'],
      })
      toast.success(
        t(
          method === 'hard'
            ? 'common.deleteSuccess'
            : 'common.softDeleteSuccess'
        )
      )
    },
  })
  const onDelete = useCallback(
    (method: DeleteMethod, thruDate?: string) =>
      mutation.mutateAsync({ method, thruDate }),
    [mutation]
  )
  return (
    <DeleteMethodDialog
      entityName='agreement party application'
      presentation='reference'
      resetDelay={300}
      onDelete={onDelete}
      onOpenChange={(open) => {
        if (!open) {
          setOpenDialog(null)
          setCurrentRow(null)
          setTimeout(() => setRowSelection({}), 300)
        }
      }}
      open={openDialog === 'deleteMethod'}
      showDatePicker
    />
  )
}
