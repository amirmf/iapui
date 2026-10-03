import { repetitiveResponseService } from '@features/repetitive-responses/services/repetitive-response-service'
import type { RepetitiveResponse } from '@iap/api-types'
import { DeleteMethodDialog } from '@iap/dialogs'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'

export function RepetitiveResponseDeleteMethodDialog(props: {
  onOpenChange: (open: boolean) => void
  open: boolean
  repetitiveResponses: RepetitiveResponse[]
  rowSelection: RowSelectionState
}) {
  const { onOpenChange, open, repetitiveResponses, rowSelection } = props
  const queryClient = useQueryClient()
  const ids = Object.entries(rowSelection).flatMap(([index, selected]) =>
    selected && repetitiveResponses[Number(index)]?.id
      ? [repetitiveResponses[Number(index)].id!]
      : []
  )
  return (
    <DeleteMethodDialog
      entityName='repetitive response'
      onDelete={async (method, thruDate) => {
        if (!ids.length) throw new Error('No repetitive responses selected')
        if (method === 'soft')
          await repetitiveResponseService.softDeleteBulk(ids, thruDate)
        else await repetitiveResponseService.bulkDelete(ids)
        await queryClient.invalidateQueries({
          queryKey: ['repetitive-responses'],
        })
      }}
      onOpenChange={onOpenChange}
      open={open}
      showDatePicker
    />
  )
}
