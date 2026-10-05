import { useCallback } from 'react'

import { useCoverageDamageCodeApplStore } from '@features/coverage-damage-code-appls/context/store/coverage-damage-code-appl-store'
import { coverageDamageCodeApplService } from '@features/coverage-damage-code-appls/services/coverage-damage-code-appl-service'
import type { CoverageDamageCodeApplFull } from '@iap/api-types'
import { type DeleteMethod, DeleteMethodDialog } from '@iap/dialogs'
import { useQueryClient } from '@tanstack/react-query'

export function CoverageDamageCodeApplDeleteMethodDialog(props: {
  appls: CoverageDamageCodeApplFull[]
}) {
  const { appls } = props
  const openDialog = useCoverageDamageCodeApplStore((state) => state.openDialog)
  const rowSelection = useCoverageDamageCodeApplStore(
    (state) => state.rowSelection
  )
  const setCurrentRow = useCoverageDamageCodeApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useCoverageDamageCodeApplStore(
    (state) => state.setOpenDialog
  )
  const setRowSelection = useCoverageDamageCodeApplStore(
    (state) => state.setRowSelection
  )
  const queryClient = useQueryClient()
  const selectedIds = Object.entries(rowSelection).flatMap(
    ([rowId, selected]) =>
      selected && appls[Number(rowId)]?.id
        ? [appls[Number(rowId)].id as string]
        : []
  )
  const onDelete = useCallback(
    async (method: DeleteMethod, thruDate?: string) => {
      if (method === 'soft')
        await coverageDamageCodeApplService.softDeleteBulk(
          selectedIds,
          thruDate
        )
      else await coverageDamageCodeApplService.bulkDelete(selectedIds)
      await queryClient.invalidateQueries({
        queryKey: ['coverage-damage-code-appls'],
      })
    },
    [queryClient, selectedIds]
  )

  return (
    <DeleteMethodDialog
      entityName='coverage damage code application'
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
