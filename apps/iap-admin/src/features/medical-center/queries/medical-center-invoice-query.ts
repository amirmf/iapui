import {
  type MedicalCenterInvoiceUploadOptions,
  medicalCenterInvoiceService,
} from '@features/medical-center/services/medical-center-invoice-service'
import type {
  MedicalCenterInvoice,
  MedicalCenterInvoiceListRequest,
  MedicalCenterInvoiceUpload,
} from '@iap/api-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const medicalCenterInvoiceKeys = {
  all: ['medical-center-invoices'] as const,
  lists: () => [...medicalCenterInvoiceKeys.all, 'list'] as const,
  list: (request: MedicalCenterInvoiceListRequest) =>
    [...medicalCenterInvoiceKeys.lists(), request] as const,
  details: () => [...medicalCenterInvoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicalCenterInvoiceKeys.details(), id] as const,
}
export type CreateMedicalCenterInvoiceVariables = {
  input: MedicalCenterInvoiceUpload
  options?: MedicalCenterInvoiceUploadOptions
}
export function useMedicalCenterInvoices(
  request: MedicalCenterInvoiceListRequest
) {
  return useQuery({
    queryKey: medicalCenterInvoiceKeys.list(request),
    queryFn: ({ signal }) =>
      medicalCenterInvoiceService.getPageFull(request, signal),
    staleTime: 30_000,
    gcTime: 30_000,
  })
}
export function useMedicalCenterInvoice(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: medicalCenterInvoiceKeys.detail(id ?? ''),
    queryFn: ({ signal }) =>
      medicalCenterInvoiceService.getById(id ?? '', signal),
    enabled: enabled && Boolean(id),
    staleTime: 30_000,
    gcTime: 30_000,
  })
}
export function useCreateMedicalCenterInvoice() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ input, options }: CreateMedicalCenterInvoiceVariables) =>
      medicalCenterInvoiceService.create(input, options),
    onSuccess: async (invoice) => {
      if (invoice.id)
        client.setQueryData(
          medicalCenterInvoiceKeys.detail(invoice.id),
          invoice
        )
      await client.invalidateQueries({
        queryKey: medicalCenterInvoiceKeys.lists(),
      })
    },
  })
}
export function useUpdateMedicalCenterInvoice() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      invoice,
    }: {
      id: string
      invoice: MedicalCenterInvoice
    }) => medicalCenterInvoiceService.update(id, invoice),
    onSuccess: async (invoice, variables) => {
      client.setQueryData(
        medicalCenterInvoiceKeys.detail(variables.id),
        invoice
      )
      await client.invalidateQueries({
        queryKey: medicalCenterInvoiceKeys.lists(),
      })
    },
  })
}
export function useDeleteMedicalCenterInvoice() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => medicalCenterInvoiceService.delete(id),
    onSuccess: async (_, id) => {
      client.removeQueries({ queryKey: medicalCenterInvoiceKeys.detail(id) })
      await client.invalidateQueries({
        queryKey: medicalCenterInvoiceKeys.lists(),
      })
    },
  })
}
