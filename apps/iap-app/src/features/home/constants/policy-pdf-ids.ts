/**
 * Policy IDs with a matching PDF at `public/policy/<policyId>.pdf`.
 * Add an ID here whenever its static PDF is published.
 */
export const policyPdfIds: readonly number[] = [41245888]

const policyPdfIdSet = new Set(policyPdfIds)

export function hasPolicyPdf(policyId: number) {
  return policyPdfIdSet.has(policyId)
}
