import { agreementService } from '@features/agreements'
import type { Agreement } from '@iap/api-types'
import { useQuery } from '@tanstack/react-query'

export type AgreementFieldValueType =
  'extContractId' | 'extPolicyId' | 'templateCode'

export const agreementOptionsQueryKeys = {
  all: ['agreement-options'] as const,
  list: (valueType: AgreementFieldValueType, search: string) =>
    [...agreementOptionsQueryKeys.all, 'list', valueType, search] as const,
  selected: (valueType: AgreementFieldValueType, selectedValue?: string) =>
    [
      ...agreementOptionsQueryKeys.all,
      'selected',
      valueType,
      selectedValue,
    ] as const,
}

export function useAgreementOptionsQuery({
  enabled = true,
  search,
  valueType,
}: {
  enabled?: boolean
  search: string
  valueType: AgreementFieldValueType
}) {
  return useQuery({
    enabled,
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: search ? { title: search } : {},
        page: 0,
        signal,
        size: 20,
      }),
    queryKey: agreementOptionsQueryKeys.list(valueType, search),
    staleTime: 30_000,
  })
}

export function useSelectedAgreementQuery({
  enabled = true,
  isEdit = false,
  selectedValue,
  valueType,
}: {
  enabled?: boolean
  isEdit?: boolean
  selectedValue?: string
  valueType: AgreementFieldValueType
}) {
  return useQuery({
    enabled: enabled && isEdit && Boolean(selectedValue),
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: { [valueType]: selectedValue },
        page: 0,
        signal,
        size: 1,
      }),
    queryKey: agreementOptionsQueryKeys.selected(valueType, selectedValue),
    staleTime: 30_000,
  })
}

export const getAgreementOptionValue = (
  agreement: Agreement,
  valueType: AgreementFieldValueType
) => agreement[valueType]
