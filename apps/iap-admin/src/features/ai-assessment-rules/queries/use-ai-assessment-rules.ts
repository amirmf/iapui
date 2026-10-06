import type {
  CreateAiAssessmentRuleRequest,
  ListAiAssessmentRulesRequest,
  PageAiAssessmentRule,
  UpdateAiAssessmentRuleRequest,
} from '@iap/api-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { aiAssessmentRuleService } from '../services/ai-assessment-rule-service'

const normalize = (request: ListAiAssessmentRulesRequest) => ({
  ...request,
  filters: Object.fromEntries(
    Object.entries(request.filters).filter(([, value]) => value !== '')
  ),
})

export const aiAssessmentRuleQueryKeys = {
  all: ['ai-assessment-rules'] as const,
  detail: (id: string) => [...aiAssessmentRuleQueryKeys.details(), id] as const,
  details: () => [...aiAssessmentRuleQueryKeys.all, 'detail'] as const,
  list: (request: ListAiAssessmentRulesRequest) =>
    [...aiAssessmentRuleQueryKeys.lists(), normalize(request)] as const,
  lists: () => [...aiAssessmentRuleQueryKeys.all, 'list'] as const,
}

export function useAiAssessmentRulesQuery(
  request: ListAiAssessmentRulesRequest
) {
  const normalized = normalize(request)
  return useQuery<PageAiAssessmentRule>({
    placeholderData: (previous) => previous,
    queryFn: ({ signal }) => aiAssessmentRuleService.list(normalized, signal),
    queryKey: aiAssessmentRuleQueryKeys.list(normalized),
  })
}

export function useAiAssessmentRuleQuery(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: ({ signal }) => aiAssessmentRuleService.getById(id, signal),
    queryKey: aiAssessmentRuleQueryKeys.detail(id),
  })
}

interface AiAssessmentRuleMutationOptions {
  onSuccess?: () => void
}

function useInvalidation(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return async () => {
    await queryClient.invalidateQueries({
      queryKey: aiAssessmentRuleQueryKeys.all,
    })
    onSuccess?.()
  }
}

export function useCreateAiAssessmentRuleMutation(
  options?: AiAssessmentRuleMutationOptions
) {
  const invalidate = useInvalidation(options?.onSuccess)
  return useMutation({
    mutationFn: (data: CreateAiAssessmentRuleRequest) =>
      aiAssessmentRuleService.create(data),
    onSuccess: invalidate,
  })
}

export function useUpdateAiAssessmentRuleMutation(
  options?: AiAssessmentRuleMutationOptions
) {
  const invalidate = useInvalidation(options?.onSuccess)
  return useMutation({
    mutationFn: (request: UpdateAiAssessmentRuleRequest) =>
      aiAssessmentRuleService.update(request),
    onSuccess: invalidate,
  })
}

export function useDeleteAiAssessmentRuleMutation() {
  const invalidate = useInvalidation()
  return useMutation({
    mutationFn: (id: string) => aiAssessmentRuleService.delete(id),
    onSuccess: invalidate,
  })
}

export function useBulkDeleteAiAssessmentRulesMutation() {
  const invalidate = useInvalidation()
  return useMutation({
    mutationFn: (ids: string[]) => aiAssessmentRuleService.bulkDelete(ids),
    onSuccess: invalidate,
  })
}
