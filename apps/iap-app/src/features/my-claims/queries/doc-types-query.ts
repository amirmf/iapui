import { docTypeService } from '@features/my-claims/services/doc-type-service'
import { useQuery } from '@tanstack/react-query'

export function useMyClaimDocTypes() {
  return useQuery({
    queryKey: ['doc-types', 'page', 0, 100],
    queryFn: ({ signal }) => docTypeService.getPage(signal),
    staleTime: 60_000,
  })
}
