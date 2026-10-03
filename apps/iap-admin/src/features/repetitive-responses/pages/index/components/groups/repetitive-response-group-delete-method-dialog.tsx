import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import type { RepetitiveResponseGroup } from '@iap/api-types'
import { DeleteMethodDialog } from '@iap/dialogs'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function RepetitiveResponseGroupDeleteMethodDialog(props: { onOpenChange: (open: boolean) => void; open: boolean; repetitiveResponseGroups: RepetitiveResponseGroup[]; rowSelection: RowSelectionState }) {
  const { onOpenChange, open, repetitiveResponseGroups, rowSelection } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const ids = Object.entries(rowSelection).flatMap(([index, selected]) => selected && repetitiveResponseGroups[Number(index)]?.id ? [repetitiveResponseGroups[Number(index)].id!] : [])
  return <DeleteMethodDialog entityName={t('repetitiveResponseGroups.entityName')} onDelete={async (method, thruDate) => { if (!ids.length) throw new Error(t('repetitiveResponseGroups.messages.noSelectionError')); if (method === 'soft') await repetitiveResponseGroupService.softDeleteBulk(ids, thruDate); else await repetitiveResponseGroupService.bulkDelete(ids); await queryClient.invalidateQueries({ queryKey: ['repetitive-response-groups'] }) }} onOpenChange={onOpenChange} open={open} showDatePicker />
}
