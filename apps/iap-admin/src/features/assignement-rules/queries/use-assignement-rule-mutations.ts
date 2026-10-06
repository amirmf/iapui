import { assignementRuleService } from '@features/assignement-rules/services/assignement-rule-service'
import type { AssignementRuleRequest } from '@iap/api-types'
import { useMutation } from '@tanstack/react-query'

type OnSuccess = () => Promise<void>

export function useCreateAssignementRule(onSuccess: OnSuccess) {
  return useMutation({
    mutationFn: (data: AssignementRuleRequest) =>
      assignementRuleService.create(data),
    onSuccess,
  })
}

export function useUpdateAssignementRule(onSuccess: OnSuccess) {
  return useMutation({
    mutationFn: ({ data, id }: { data: AssignementRuleRequest; id: string }) =>
      assignementRuleService.update(id, data),
    onSuccess,
  })
}

export function useDeleteAssignementRule(onSuccess: OnSuccess) {
  return useMutation({
    mutationFn: (id: string) => assignementRuleService.delete(id),
    onSuccess,
  })
}

export function useBulkDeleteAssignementRules(
  ids: string[],
  onSuccess: OnSuccess
) {
  return useMutation({
    mutationFn: () => assignementRuleService.bulkDelete(ids),
    onSuccess,
  })
}
