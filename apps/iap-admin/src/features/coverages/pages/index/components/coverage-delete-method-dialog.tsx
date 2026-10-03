import { useCallback } from 'react'

import { useCoverageStore } from '@features/coverages/model/coverage-store'
import { coverageService } from '@features/coverages/services/coverage-service'
import type { Coverage } from '@iap/api-types'
import { type DeleteMethod, DeleteMethodDialog } from '@iap/dialogs'
import { useQueryClient } from '@tanstack/react-query'

export function CoverageDeleteMethodDialog(props: { coverages: Coverage[] }) {
  const { coverages } = props
  const openDialog = useCoverageStore((state) => state.openDialog)
  const rowSelection = useCoverageStore((state) => state.rowSelection)
  const setOpenDialog = useCoverageStore((state) => state.setOpenDialog)
  const setRowSelection = useCoverageStore((state) => state.setRowSelection)
  const queryClient = useQueryClient()
  const selectedIds = Object.entries(rowSelection).flatMap(
    ([rowId, selected]) =>
      selected && coverages[Number(rowId)]?.id
        ? [coverages[Number(rowId)].id!]
        : []
  )
  const onDelete = useCallback(
    async (method: DeleteMethod, thruDate?: string) => {
      if (method === 'soft')
        await coverageService.softDeleteBulk(selectedIds, thruDate)
      else await coverageService.bulkDelete(selectedIds)
      await queryClient.invalidateQueries({ queryKey: ['coverages'] })
    },
    [queryClient, selectedIds]
  )
  return (
    <DeleteMethodDialog
      entityName='coverage'
      onDelete={onDelete}
      onOpenChange={(open) => {
        if (!open) {
          setOpenDialog(null)
          setTimeout(() => setRowSelection({}), 300)
        }
      }}
      open={openDialog === 'deleteMethod'}
      showDatePicker
    />
  )
}
