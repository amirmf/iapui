import { usePersonSpecialDiseaseStore } from '@features/person-special-diseases/context/store/person-special-disease-store'
import { getSelectedPersonSpecialDiseaseIds } from '@features/person-special-diseases/model/person-special-disease-row-selection'
import type { PersonSpecialDisease } from '@iap/api-types'
import { type DeleteMethod, DeleteMethodDialog } from '@iap/dialogs'
import { personSpecialDiseaseService } from '@modules/person-special-diseases'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type PersonSpecialDiseaseBulkDeleteDialogProps = {
  refetch?: () => Promise<unknown> | void
  rows: PersonSpecialDisease[]
}

export function PersonSpecialDiseaseBulkDeleteDialog(
  props: PersonSpecialDiseaseBulkDeleteDialogProps
) {
  const { refetch, rows } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const openDialog = usePersonSpecialDiseaseStore((state) => state.openDialog)
  const rowSelection = usePersonSpecialDiseaseStore(
    (state) => state.rowSelection
  )
  const setOpenDialog = usePersonSpecialDiseaseStore(
    (state) => state.setOpenDialog
  )
  const setRowSelection = usePersonSpecialDiseaseStore(
    (state) => state.setRowSelection
  )
  const ids = getSelectedPersonSpecialDiseaseIds(rowSelection, rows)
  const mutation = useMutation({
    mutationFn: async ({
      ids: selectedIds,
      method,
      thruDate,
    }: {
      ids: string[]
      method: DeleteMethod
      thruDate?: string
    }) => {
      if (!selectedIds.length) {
        throw new Error(t('personSpecialDiseases.errors.noRowsSelected'))
      }
      if (method === 'soft') {
        await personSpecialDiseaseService.softDelete(selectedIds, thruDate)
      } else {
        await personSpecialDiseaseService.bulkDelete(selectedIds)
      }
    },
    onSuccess: async (_result, variables) => {
      await refetch?.()
      await queryClient.invalidateQueries({
        queryKey: ['person-special-diseases'],
      })
      toast.success(
        variables.method === 'soft'
          ? t('common.softDeleteSuccess')
          : t('common.deleteSuccess')
      )
      setRowSelection({})
    },
  })

  return (
    <DeleteMethodDialog
      entityName={t('personSpecialDiseases.entityName')}
      isLoading={mutation.isPending}
      onDelete={(method, thruDate) =>
        mutation.mutateAsync({ ids, method, thruDate })
      }
      onOpenChange={(open) => setOpenDialog(open ? 'bulkDelete' : null)}
      open={openDialog === 'bulkDelete'}
      resetDelay={300}
      showDatePicker
    />
  )
}
