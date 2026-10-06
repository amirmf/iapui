import { getApiClient } from '@iap/api-client'
import {
  type AgreementCoverageApplForm,
  agreementCoverageApplPageRequestSchema,
  agreementCoverageApplSchema,
  bulkDeleteAgreementCoverageApplsRequestSchema,
  createAgreementCoverageApplRequestSchema,
  getAgreementCoverageApplRequestSchema,
  initializeAgreementCoverageApplsRequestSchema,
  pageAgreementCoverageApplFullSchema,
  softDeleteAgreementCoverageApplRequestSchema,
  softDeleteAgreementCoverageApplsRequestSchema,
  updateAgreementCoverageApplRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function serialize(value: AgreementCoverageApplForm) {
  return {
    ...value,
    fromDate: value.fromDate?.toISOString(),
    thruDate: value.thruDate?.toISOString(),
  }
}
export const agreementCoverageApplService = {
  async getPage(input: {
    filters?: ApiFilterParams
    page?: number
    size?: number
  }) {
    const request = agreementCoverageApplPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get(
      '/agreement-coverage-appls/page-full',
      {
        params: {
          page: request.page,
          size: request.size,
          ...transformApiFilterParams(request.filters),
        },
      }
    )
    return pageAgreementCoverageApplFullSchema.parse(response.data)
  },
  async create(input: AgreementCoverageApplForm) {
    const request = createAgreementCoverageApplRequestSchema.parse(input)
    return agreementCoverageApplSchema.parse(
      (
        await getApiClient().post(
          '/agreement-coverage-appls',
          serialize(request)
        )
      ).data
    )
  },
  async update(id: string, input: AgreementCoverageApplForm) {
    const request = updateAgreementCoverageApplRequestSchema.parse({
      body: input,
      path: { id },
    })
    return agreementCoverageApplSchema.parse(
      (
        await getApiClient().patch(
          `/agreement-coverage-appls/${request.path.id}`,
          { ...serialize(request.body), id: request.path.id }
        )
      ).data
    )
  },
  async initialize(agreementId: string) {
    await getApiClient().post(
      '/agreement-coverage-appls/initialize',
      initializeAgreementCoverageApplsRequestSchema.parse({ agreementId })
    )
  },
  async softDelete(id: string, thruDate?: Date | string) {
    const request = softDeleteAgreementCoverageApplRequestSchema.parse({
      path: { id },
      query: {
        thruDate: thruDate instanceof Date ? thruDate.toISOString() : thruDate,
      },
    })
    return agreementCoverageApplSchema.parse(
      (
        await getApiClient().put(
          `/agreement-coverage-appls/soft-delete/${request.path.id}`,
          null,
          {
            params: request.query.thruDate
              ? { thruDate: request.query.thruDate }
              : {},
          }
        )
      ).data
    )
  },
  async softDeleteBulk(ids: string[], thruDate?: Date | string) {
    const request = softDeleteAgreementCoverageApplsRequestSchema.parse({
      body: ids,
      query: {
        thruDate: thruDate instanceof Date ? thruDate.toISOString() : thruDate,
      },
    })
    return agreementCoverageApplSchema.array().parse(
      (
        await getApiClient().put(
          '/agreement-coverage-appls/soft-delete',
          request.body,
          {
            params: request.query.thruDate
              ? { thruDate: request.query.thruDate }
              : {},
          }
        )
      ).data
    )
  },
  async bulkDelete(ids: string[]) {
    await getApiClient().delete('/agreement-coverage-appls/bulk-delete', {
      data: bulkDeleteAgreementCoverageApplsRequestSchema.parse(ids),
    })
  },
  async delete(id: string) {
    const request = getAgreementCoverageApplRequestSchema.parse({
      path: { id },
    })
    await getApiClient().delete(`/agreement-coverage-appls/${request.path.id}`)
  },
}
