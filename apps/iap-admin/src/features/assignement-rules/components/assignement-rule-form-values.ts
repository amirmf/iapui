import type { AssignementRuleForm } from '@features/assignement-rules/model/assignement-rule-form-schema'
import type { AssignementRule, AssignementRuleRequest } from '@iap/api-types'

const emptyValues: AssignementRuleForm = {
  status: 'ACTIVE',
  title: '',
}

function toOptionalNumber(value: string | undefined): number | undefined {
  return value === undefined || value === '' ? undefined : Number(value)
}

export function toRequestData(
  data: AssignementRuleForm
): AssignementRuleRequest {
  return {
    ...data,
    amountApprovedMax: toOptionalNumber(data.amountApprovedMax),
    amountApprovedMin: toOptionalNumber(data.amountApprovedMin),
    amountMax: toOptionalNumber(data.amountMax),
    amountMin: toOptionalNumber(data.amountMin),
    extContractId: toOptionalNumber(data.extContractId),
    extPolicyId: toOptionalNumber(data.extPolicyId),
    extWorkUnitCode: toOptionalNumber(data.extWorkUnitCode),
  }
}

export function toFormValues(
  rule?: AssignementRule | null
): AssignementRuleForm {
  if (!rule) return emptyValues
  return {
    amountApprovedMax: rule.amountApprovedMax?.toString() ?? '',
    amountApprovedMin: rule.amountApprovedMin?.toString() ?? '',
    amountMax: rule.amountMax?.toString() ?? '',
    amountMin: rule.amountMin?.toString() ?? '',
    docTypeCode: rule.docTypeCode ?? '',
    extContractId: rule.extContractId?.toString() ?? '',
    extPolicyId: rule.extPolicyId?.toString() ?? '',
    extWorkUnitCode: rule.extWorkUnitCode?.toString() ?? '',
    fromDate: rule.fromDate ? new Date(rule.fromDate) : undefined,
    mainAssignedUserUsername: rule.mainAssignedUserUsername ?? '',
    status: rule.status ?? 'ACTIVE',
    thruDate: rule.thruDate ? new Date(rule.thruDate) : undefined,
    title: rule.title ?? '',
  }
}
