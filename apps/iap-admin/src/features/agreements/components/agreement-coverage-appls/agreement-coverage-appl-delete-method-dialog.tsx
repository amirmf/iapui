import { agreementCoverageApplService } from '@features/agreements/services/agreement-coverage-appl-service'
import type { AgreementCoverageApplFull } from '@iap/api-types'
import { type DeleteMethod, DeleteMethodDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  appls: AgreementCoverageApplFull[]
  rowSelection: RowSelectionState
}

export function AgreementCoverageApplDeleteMethodDialog(props: Props) {
  const { open, onOpenChange, appls, rowSelection } = props
  const { t } = useTranslate()
  const queryClient = useQueryClient()
  // Get all selected appl IDs from rowSelection
  const selectedApplIds = Object.keys(rowSelection).reduce<string[]>(
    (ids, index) => {
      const id = appls[Number(index)]?.id
      return id ? [...ids, id] : ids
    },
    []
  )

  const handleSoftDelete = async (thruDate?: string) => {
    if (selectedApplIds.length === 0) {
      throw new Error('No agreement coverage appls selected')
    }
    await agreementCoverageApplService.softDeleteBulk(selectedApplIds, thruDate)
  }

  const handleHardDelete = async () => {
    if (selectedApplIds.length === 0) {
      throw new Error('No agreement coverage appls selected')
    }
    await agreementCoverageApplService.bulkDelete(selectedApplIds)
  }

  const deleteMutation = useMutation({
    mutationFn: async (request: {
      method: DeleteMethod
      thruDate?: string
    }) => {
      if (request.method === 'soft') await handleSoftDelete(request.thruDate)
      else await handleHardDelete()
    },
    onSuccess: (_, { method }) => {
      void queryClient.invalidateQueries({
        queryKey: ['agreement-coverage-appls'],
      })
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
      presentation='reference'
      resetDelay={300}
      open={open}
      onOpenChange={onOpenChange}
      entityName='agreement coverage appl'
      onDelete={(method: DeleteMethod, thruDate?: string) =>
        deleteMutation.mutateAsync({ method, thruDate })
      }
      showDatePicker={true}
    />
  )
}
