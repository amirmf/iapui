import { ClaimRequestInfoListContent } from '@features/claim-requests/components/claim-request-info-list-content'
import type { ClaimRequest } from '@iap/api-types'

export function ClaimRequestReadonlyInfoList(props: { data?: ClaimRequest }) {
  const { data } = props
  return <ClaimRequestInfoListContent data={data} />
}
