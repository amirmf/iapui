import type { PersonSpecialDisease } from '@iap/api-types'
import type { RowSelectionState } from '@tanstack/react-table'

export function getSelectedPersonSpecialDiseaseIds(
  rowSelection: RowSelectionState,
  rows: PersonSpecialDisease[]
) {
  return Object.keys(rowSelection).flatMap((index) => {
    const id = rows[Number(index)]?.id
    return id ? [id] : []
  })
}
