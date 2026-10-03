import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import type { RepetitiveResponseGroup } from '@iap/api-types'
import { DeleteMethodDialog } from '@iap/dialogs'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

type Props = {
  onOpenChange: (open: boolean) => void
  open: boolean
  repetitiveResponseGroups: RepetitiveResponseGroup[]
  rowSelection: RowSelectionState
}

function getSelectedGroupIds(
  groups: RepetitiveResponseGroup[],
  rowSelection: RowSelectionState
) {
  return Object.entries(rowSelection).reduce<string[]>(
    (ids, [index, isSelected]) => {
      if (!isSelected) return ids

      const id = groups[Number(index)]?.id
      return id ? [...ids, id] : ids
    },
    []
  )
}

export function RepetitiveResponseGroupDeleteMethodDialog({
  onOpenChange,
  open,
  repetitiveResponseGroups,
  rowSelection,
}: Props) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const selectedGroupIds = getSelectedGroupIds(
    repetitiveResponseGroups,
    rowSelection
  )

  const handleDelete = async (method: 'hard' | 'soft', thruDate?: string) => {
    if (selectedGroupIds.length === 0) {
      throw new Error(t('repetitiveResponseGroups.messages.noSelectionError'))
    }

    if (method === 'soft') {
      await repetitiveResponseGroupService.softDeleteBulk(
        selectedGroupIds,
        thruDate
      )
    } else {
      await repetitiveResponseGroupService.bulkDelete(selectedGroupIds)
    }

    await queryClient.invalidateQueries({
      queryKey: ['repetitive-response-groups'],
    })
  }

  return (
    <DeleteMethodDialog
      entityName={t('repetitiveResponseGroups.entityName')}
      onDelete={handleDelete}
      onOpenChange={onOpenChange}
      open={open}
      showDatePicker
    />
  )
}
