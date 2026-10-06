import { agreementService } from '@features/agreements'
import { useQuery } from '@tanstack/react-query'

export function useAssignementRuleAgreements(props: {
  enabled: boolean
  isEdit: boolean
  debouncedSearch: string
  selectedFieldValue: string | undefined
}) {
  const { enabled, isEdit, debouncedSearch, selectedFieldValue } = props
  const { data: agreementPage, isFetching } = useQuery({
    enabled,
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: debouncedSearch ? { title: debouncedSearch } : {},
        page: 0,
        signal,
        size: 20,
      }),
    queryKey: ['agreement-options', 'extPolicyId', debouncedSearch],
    staleTime: 30_000,
  })

  const { data: selectedAgreementPage } = useQuery({
    enabled: enabled && isEdit && Boolean(selectedFieldValue),
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: { extPolicyId: selectedFieldValue! },
        page: 0,
        signal,
        size: 1,
      }),
    queryKey: ['agreement-selected-option', 'extPolicyId', selectedFieldValue],
    staleTime: 30_000,
  })

  return { agreementPage, isFetching, selectedAgreementPage }
}
