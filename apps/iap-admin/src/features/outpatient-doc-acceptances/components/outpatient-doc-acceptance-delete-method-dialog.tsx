import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import { type OutpatientDocAcceptance } from '@iap/api-types'
import { DeleteMethodDialog } from '@iap/dialogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type RowSelectionState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  outpatientDocAcceptances: OutpatientDocAcceptance[]
  rowSelection: RowSelectionState
}

export function OutpatientDocAcceptanceDeleteMethodDialog({
  open,
  onOpenChange,
  outpatientDocAcceptances,
  rowSelection,
}: Props) {
  const { t: translate } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string

  const selectedOutpatientDocAcceptanceIds = Object.keys(rowSelection).reduce<
    string[]
  >((ids, index) => {
    const id = outpatientDocAcceptances[Number(index)]?.id
    return id ? [...ids, id] : ids
  }, [])

  const handleSoftDelete = async (thruDate?: string) => {
    if (selectedOutpatientDocAcceptanceIds.length === 0) {
      throw new Error('No outpatient document acceptances selected')
    }

    await outpatientDocAcceptanceService.softDelete(
      selectedOutpatientDocAcceptanceIds,
      thruDate
    )
  }

  const handleHardDelete = async () => {
    if (selectedOutpatientDocAcceptanceIds.length === 0) {
      throw new Error('No outpatient document acceptances selected')
    }

    await outpatientDocAcceptanceService.bulkDelete(
      selectedOutpatientDocAcceptanceIds
    )
  }

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({
      method,
      thruDate,
    }: {
      method: 'soft' | 'hard'
      thruDate?: string
    }) => {
      if (method === 'soft') await handleSoftDelete(thruDate)
      else await handleHardDelete()
    },
    onSuccess: (_, { method }) => {
      void queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(
        method === 'soft'
          ? t('common.softDeleteSuccess') || 'Item soft deleted successfully'
          : t('common.deleteSuccess') || 'Item deleted successfully'
      )
    },
  })

  return (
    <DeleteMethodDialog
      open={open}
      onOpenChange={onOpenChange}
      entityName={t('outpatientDocAcceptances.entityName')}
      presentation='reference'
      resetDelay={300}
      isLoading={mutation.isPending}
      onDelete={(method, thruDate) =>
        mutation.mutateAsync({ method, thruDate })
      }
      showDatePicker={true}
    />
  )
}
