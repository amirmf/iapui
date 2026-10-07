# TASK-05: Route Adapters and Search State

## Objective
Implement route search validation schemas and URL search adapters for the Sub-Users page, translating between URL query parameters, table state, and backend pagination.

## Reference Source
- `insurance-ui/src/features/sub-users/components/sub-user-section.tsx`
- `insurance-ui/src/features/sub-users/components/sub-users-data-table-toolbar.tsx`
- `insurance-ui/src/components/data-table/filter/use-sync-query-params-table-filter.ts`

## Implementation Target
1. `apps/iap-admin/src/features/sub-users/route-adapters/route-search-schema.ts`
2. `apps/iap-admin/src/features/sub-users/route-adapters/use-sub-user-table-state.ts`

## Detailed Specifications

### 1. Route Search Schema (`route-search-schema.ts`)
```ts
import { z } from 'zod'

export const subUserRouteSearchSchema = z
  .object({
    page: z.string().optional(),
    size: z.string().optional(),
    username: z.string().optional(),
    displayName: z.string().optional(),
    mobileNumber: z.string().optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .catchall(z.union([z.string(), z.number(), z.array(z.string())]))

export type SubUserRouteSearch = z.infer<typeof subUserRouteSearchSchema>
```

### 2. URL Table State Adapter (`use-sub-user-table-state.ts`)
Uses `useTableFilterQueryParams` from `@shared/tables`:
- Synchronizes `page`, `size`, `filters` with TanStack Router search state.
- Resets page to 0 when filters change.
- Maps `status` filter array/string into API format.

## Acceptance Criteria
- [ ] Validates route parameters at router boundary without discarding valid filters.
- [ ] Preserves URL shareability for filtered views.
- [ ] Safe fallback when invalid query parameters are encountered.
