import type { statusHistoryItemType } from '@iap/api-types'

export function myIapFindTimeStamp(
  statusHistory?: statusHistoryItemType[] | null
) {
  const tmp = statusHistory?.concat([])?.reverse()
  let statusApproved: string | null | undefined = null
  let statusPaid: string | null | undefined = null
  let statusReturn: string | null | undefined = null
  tmp?.forEach((item) => {
    if (item.status === 'APPROVED') {
      statusApproved = item.timestamp
    }
    if (item.status === 'PAID') {
      statusPaid = item.timestamp
    }
    if (item.status === 'RETURN') {
      statusReturn = item.timestamp
    }
  })
  return { statusReturn, statusPaid, statusApproved }
}
