import type { AssignementRule } from '@iap/api-types'
import type { RowSelectionState } from '@tanstack/react-table'

export function getSelectedAssignementRuleIds(
  rowSelection: RowSelectionState,
  rows: AssignementRule[]
): string[] {
  return Object.entries(rowSelection)
    .filter(([, selected]) => Boolean(selected))
    .map(([rowId]) => rows[Number(rowId)]?.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
}
