import { getApiClient } from '@iap/api-client'
import {
  type AgreementPartyApplForm,
  agreementPartyApplBulkCreateRequestSchema,
  agreementPartyApplBulkCreateWithRoleRequestSchema,
  agreementPartyApplPageRequestSchema,
  agreementPartyApplSchema,
  agreementPartyApplicationsPageRequestSchema,
  agreementPartyApplicationsRequestSchema,
  bulkDeleteAgreementPartyApplsRequestSchema,
  createAgreementPartyApplRequestSchema,
  pageAgreementPartyApplFullSchema,
  pageAgreementPartyApplSchema,
  softDeleteAgreementPartyApplRequestSchema,
  softDeleteAgreementPartyApplsRequestSchema,
  updateAgreementPartyApplRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

const referencePartyApplicationMethods = {
  async getPartyApplications(input: {
    agreementId: string
    filters?: Record<string, string | number | boolean | null | undefined>
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = agreementPartyApplicationsRequestSchema.parse({
      agreementId: input.agreementId,
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 30,
    })
    const response = await getApiClient().get(
      '/agreement-party-appls/page-full',
      {
        params: {
          page: request.page,
          size: request.size,
          agreementId: request.agreementId,
          ...transformApiFilterParams(request.filters),
        },
        signal: input.signal,
      }
    )
    return pageAgreementPartyApplFullSchema.parse(response.data)
  },
  async getPartyApplicationsPageFull(input: {
    agreementId?: string[] | null
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
    userAccountId?: string[] | null
  }) {
    const request = agreementPartyApplPageRequestSchema.parse({
      agreementIds: input.agreementId,
      userAccountIds: input.userAccountId,
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 30,
    })
    const response = await getApiClient().get(
      '/agreement-party-appls/page-full',
      {
        params: {
          agreementId__in: request.agreementIds?.join(','),
          page: request.page,
          size: request.size,
          userAccountId__in: request.userAccountIds?.join(','),
          ...transformApiFilterParams(request.filters),
        },
        signal: input.signal,
      }
    )
    return pageAgreementPartyApplFullSchema.parse(response.data)
  },
  async getPartyApplicationsPage(input: {
    agreementId?: string
    filters?: Record<string, string | number | boolean | null | undefined>
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = agreementPartyApplicationsPageRequestSchema.parse({
      agreementId: input.agreementId,
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 30,
    })
    const response = await getApiClient().get('/agreement-party-appls/page', {
      params: {
        ...(request.agreementId ? { agreementId: request.agreementId } : {}),
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return pageAgreementPartyApplSchema.parse(response.data)
  },
  async createPartyApplication(
    agreementId: string,
    input: AgreementPartyApplForm
  ) {
    const request = createAgreementPartyApplRequestSchema.parse(input)
    return agreementPartyApplSchema.parse(
      (
        await getApiClient().post('/agreement-party-appls', {
          ...request,
          agreementId,
          fromDate: request.fromDate?.toISOString(),
          thruDate: request.thruDate?.toISOString(),
        })
      ).data
    )
  },
  async updatePartyApplication(
    id: string,
    agreementId: string,
    input: AgreementPartyApplForm
  ) {
    const request = updateAgreementPartyApplRequestSchema.parse({
      body: input,
      path: { id },
    })
    return agreementPartyApplSchema.parse(
      (
        await getApiClient().put(`/agreement-party-appls/${request.path.id}`, {
          ...request.body,
          agreementId,
          id,
          fromDate: request.body.fromDate?.toISOString(),
          thruDate: request.body.thruDate?.toISOString(),
        })
      ).data
    )
  },
  async bulkCreatePartyApplicationsWithRole(input: unknown) {
    const request =
      agreementPartyApplBulkCreateWithRoleRequestSchema.parse(input)
    return agreementPartyApplSchema
      .array()
      .parse(
        (
          await getApiClient().post(
            '/agreement-party-appls/bulk-create-with-role',
            request
          )
        ).data
      )
  },
  async softDeletePartyApplicationBulk(
    ids: string[],
    thruDate?: Date | string
  ) {
    const request = softDeleteAgreementPartyApplsRequestSchema.parse({
      body: ids,
      query: {
        thruDate: thruDate instanceof Date ? thruDate.toISOString() : thruDate,
      },
    })
    return agreementPartyApplSchema.array().parse(
      (
        await getApiClient().put(
          '/agreement-party-appls/soft-delete',
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
  async softDeletePartyApplication(id: string, thruDate?: Date) {
    const request = softDeleteAgreementPartyApplRequestSchema.parse({
      path: { id },
      query: {
        thruDate: thruDate?.toISOString(),
      },
    })
    return agreementPartyApplSchema.parse(
      (
        await getApiClient().put(
          `/agreement-party-appls/soft-delete/${request.path.id}`,
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
  async bulkCreatePartyApplications(input: {
    agreementIds: string[]
    userAccountIds: string[]
    docTypeCodes: string[]
  }) {
    const request = agreementPartyApplBulkCreateRequestSchema.parse(input)
    return agreementPartyApplSchema
      .array()
      .parse(
        (
          await getApiClient().post(
            '/agreement-party-appls/bulk-create',
            request
          )
        ).data
      )
  },
  async bulkDeletePartyApplication(ids: string[]) {
    await getApiClient().delete('/agreement-party-appls/bulk-delete', {
      data: bulkDeleteAgreementPartyApplsRequestSchema.parse(ids),
    })
  },
}

// Keep the original target interface available for existing consumers while
// Agreements uses the verified reference method names.
export const agreementPartyApplService = {
  ...referencePartyApplicationMethods,
  getPage(input: {
    agreementIds?: string[] | null
    userAccountIds?: string[] | null
    filters?: ApiFilterParams
    page?: number
    size?: number
    signal?: AbortSignal
  }) {
    return referencePartyApplicationMethods.getPartyApplicationsPageFull({
      ...input,
      agreementId: input.agreementIds,
      userAccountId: input.userAccountIds,
    })
  },
  getPageStandard: referencePartyApplicationMethods.getPartyApplicationsPage,
  create: referencePartyApplicationMethods.createPartyApplication,
  update: referencePartyApplicationMethods.updatePartyApplication,
  bulkCreateWithRole:
    referencePartyApplicationMethods.bulkCreatePartyApplicationsWithRole,
  softDeleteBulk:
    referencePartyApplicationMethods.softDeletePartyApplicationBulk,
  softDelete: referencePartyApplicationMethods.softDeletePartyApplication,
  bulkCreate: referencePartyApplicationMethods.bulkCreatePartyApplications,
  bulkDelete: referencePartyApplicationMethods.bulkDeletePartyApplication,
}
