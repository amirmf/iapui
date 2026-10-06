# TASK-03: Backend Service and Query Hooks

## Objective
Implement `assignementRuleService` using `@iap/api-client` and `@iap/shared-lib` filter transformer, with TanStack Query hooks for server state ownership.

## Reference Source
- `insurance-ui/src/features/assignement-rules/services/assignement-rule-service.ts`
- `insurance-ui/src/features/assignement-rules/hooks/use-assignement-rules-data.ts`

## Implementation Target
- `apps/iap-admin/src/features/assignement-rules/services/assignement-rule-service.ts`
- `apps/iap-admin/src/features/assignement-rules/queries/use-assignement-rules-query.ts`
- `apps/iap-admin/src/features/assignement-rules/services/assignement-rule-service.test.ts`

## 1. Service Implementation (`assignement-rule-service.ts`)
Must validate outgoing payloads and incoming responses with `@iap/api-types` schemas:

```ts
import { getApiClient } from '@iap/api-client'
import {
  type AssignementRule,
  type AssignementRuleRequest,
  type PageAssignementRule,
  assignementRuleIdsSchema,
  assignementRulePageRequestSchema,
  assignementRuleRequestSchema,
  assignementRuleSchema,
  pageAssignementRuleSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function toPayload(data: AssignementRuleRequest) {
  return {
    ...data,
    fromDate: data.fromDate?.toISOString(),
    thruDate: data.thruDate?.toISOString(),
  }
}

export const assignementRuleService = {
  async getPage(params: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }): Promise<PageAssignementRule> {
    const request = assignementRulePageRequestSchema.parse({
      filters: params.filters ?? {},
      page: params.page ?? 0,
      size: params.size ?? 30,
    })
    const response = await getApiClient().get('/assignement-rules/page-full', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: params.signal,
    })
    return pageAssignementRuleSchema.parse(response.data)
  },

  async getById(id: string, signal?: AbortSignal): Promise<AssignementRule> {
    const response = await getApiClient().get(`/assignement-rules/${id}`, {
      signal,
    })
    return assignementRuleSchema.parse(response.data)
  },

  async create(data: AssignementRuleRequest): Promise<AssignementRule> {
    const valid = assignementRuleRequestSchema.parse(data)
    const response = await getApiClient().post(
      '/assignement-rules',
      toPayload(valid)
    )
    return assignementRuleSchema.parse(response.data)
  },

  async update(
    id: string,
    data: AssignementRuleRequest
  ): Promise<AssignementRule> {
    const valid = assignementRuleRequestSchema.parse(data)
    const response = await getApiClient().put(`/assignement-rules/${id}`, {
      ...toPayload(valid),
      id,
    })
    return assignementRuleSchema.parse(response.data)
  },

  async delete(id: string): Promise<void> {
    await getApiClient().delete(`/assignement-rules/${id}`)
  },

  async bulkDelete(ids: string[]): Promise<void> {
    const validIds = assignementRuleIdsSchema.parse(ids)
    await getApiClient().delete('/assignement-rules/bulk-delete', {
      data: validIds,
    })
  },
}
```

## 2. TanStack Query Hook (`use-assignement-rules-query.ts`)
```ts
import { useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'
import type { ApiFilterParams } from '@iap/shared-lib'
import type { PageAssignementRule } from '@iap/api-types'
import { assignementRuleService } from '../services/assignement-rule-service'

export function useAssignementRulesQuery(params: {
  filters: ApiFilterParams
  pagination: PaginationState
}) {
  const { filters, pagination } = params

  return useQuery<PageAssignementRule>({
    queryKey: ['assignement-rules', pagination, filters],
    queryFn: ({ signal }) =>
      assignementRuleService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
    gcTime: 30_000,
  })
}
```

## 3. Unit Tests (`assignement-rule-service.test.ts`)
- Mock API responses with Vitest.
- Verify exact paths (`/assignement-rules/page-full`, `/assignement-rules/bulk-delete`, etc.).
- Verify payload conversion (`fromDate`, `thruDate` serialized to ISO string).
- Verify parameter serialization through `transformApiFilterParams`.

## Acceptance Criteria
- [ ] Endpoints and HTTP methods match reference project exactly:
  - `GET /assignement-rules/page-full`
  - `GET /assignement-rules/{id}`
  - `POST /assignement-rules`
  - `PUT /assignement-rules/{id}`
  - `DELETE /assignement-rules/{id}`
  - `DELETE /assignement-rules/bulk-delete`
- [ ] Input and output validated through Zod v4 schemas.
- [ ] Comprehensive unit tests verify requests, parameters, and responses.
