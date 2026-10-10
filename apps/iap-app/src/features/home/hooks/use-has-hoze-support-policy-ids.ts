import { useGetMyInsurancePolicy } from '@modules/insurance-policies'

import { isHozeSupportPolicyId } from '../constants/hoze-support-policy-ids'

export function useHasHozeSupportPolicyIds(): boolean {
  const { data: insurancePolicies } = useGetMyInsurancePolicy()

  return Boolean(
    insurancePolicies?.some((policy) => isHozeSupportPolicyId(policy.id))
  )
}

export default useHasHozeSupportPolicyIds
