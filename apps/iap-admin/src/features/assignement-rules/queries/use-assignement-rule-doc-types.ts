import { docTypeService } from '@modules/doc-types'
import { useQuery } from '@tanstack/react-query'

export function useAssignementRuleDocTypes(enabled = true) {
  return useQuery({
    enabled,
    queryFn: ({ signal }) =>
      docTypeService.getPage({ page: 0, signal, size: 100 }),
    queryKey: ['doc-types', 'page', 0, 100],
    staleTime: Infinity,
  })
}
