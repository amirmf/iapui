import type { ClaimRequest } from '@iap/api-types'
import type { Row } from '@tanstack/react-table'

export function getClaimRequestRowClassName(row: Row<ClaimRequest>) {
  const diseases = row.original.specialDiseases ?? []
  if (!diseases.length) return undefined
  return diseases.includes('VIP')
    ? 'special-disease-row bg-primary/10 hover:bg-primary/15 data-[state=selected]:bg-primary/20'
    : 'special-disease-row bg-destructive/10 hover:bg-destructive/15 data-[state=selected]:bg-destructive/20'
}
