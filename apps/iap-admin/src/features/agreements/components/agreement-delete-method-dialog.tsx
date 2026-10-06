import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import { agreementService } from '@features/agreements/services/agreement-service'
import { type DeleteMethod, DeleteMethodDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function AgreementDeleteMethodDialog() {
  const { t } = useTranslate()
  const openDialog = useAgreementStore((state) => state.openDialog)
  const selectedAgreement = useAgreementStore(
    (state) => state.selectedAgreement
  )
  const setOpenDialog = useAgreementStore((state) => state.setOpenDialog)
  const setRowSelection = useAgreementStore((state) => state.setRowSelection)
  const queryClient = useQueryClient()
  const ids = selectedAgreement.flatMap((agreement) =>
    agreement.id ? [agreement.id] : []
  )
  const mutation = useMutation({
    mutationFn: async ({
      method,
      thruDate,
    }: {
      method: DeleteMethod
      thruDate?: string
    }) => {
      if (!ids.length) throw new Error('No agreements selected')
      if (method === 'soft')
        await agreementService.softDeleteBulk(ids, thruDate)
      else await agreementService.bulkDelete(ids)
    },
    onSuccess: (_, { method }) => {
      void queryClient.invalidateQueries({ queryKey: ['agreements'] })
      toast.success(
        t(
          method === 'soft'
            ? 'common.softDeleteSuccess'
            : 'common.deleteSuccess'
        )
      )
    },
  })

  return (
    <DeleteMethodDialog
      entityName='agreement'
      presentation='reference'
      resetDelay={300}
      isLoading={mutation.isPending}
      onDelete={(method, thruDate) =>
        mutation.mutateAsync({ method, thruDate })
      }
      onOpenChange={(open) => {
        if (!open) {
          setOpenDialog(null)
          setRowSelection({})
        }
      }}
      open={openDialog === 'deleteMethod'}
      showDatePicker
    />
  )
}
