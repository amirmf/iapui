# TASK-05: Route Adapters and Search State

## Objective
Implement route search validation and URL table search serialization/deserialization in `route-adapters/` to integrate with TanStack Router.

## Reference Source
- `insurance-ui/src/features/assignement-rules/pages/assignement-rules-page.tsx` (uses `useSyncQueryParamsTableFilter`)
- Target patterns in `apps/iap-admin/src/features/person-special-diseases/route-adapters/` and `apps/iap-admin/src/features/damage-codes/route-adapters/`

## Implementation Target
- `apps/iap-admin/src/features/assignement-rules/route-adapters/route-search-schema.ts`
- `apps/iap-admin/src/features/assignement-rules/route-adapters/table-search.ts`
- `apps/iap-admin/src/features/assignement-rules/route-adapters/table-search.test.ts`

## 1. Route Search Schema (`route-search-schema.ts`)
Validates incoming search parameters in TanStack Router:
```ts
import { z } from 'zod'

export const assignementRuleRouteSearchSchema = z
  .object({
    page: z.string().optional(),
    size: z.string().optional(),
  })
  .catchall(z.union([z.string(), z.number(), z.array(z.string())]))

export type AssignementRuleRouteSearch = z.infer<
  typeof assignementRuleRouteSearchSchema
>
```

## 2. Table Search Adapter (`table-search.ts`)
Adapts between URL search parameters and TanStack Table / API filter state:
```ts
import type { TableFilterSearch } from '@shared/tables'
import type { PaginationState } from '@tanstack/react-table'

const reservedSearchKeys = new Set(['page', 'size'])

export type AssignementRuleTableSearchState = {
  filters: TableFilterSearch
  pagination: PaginationState
}

function parsePositiveInteger(value: unknown, fallback: number): number {
  if (typeof value !== 'string') return fallback
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseAssignementRuleTableSearch(
  search: TableFilterSearch
): AssignementRuleTableSearchState {
  const filters: TableFilterSearch = {}

  for (const [key, value] of Object.entries(search)) {
    if (!reservedSearchKeys.has(key)) filters[key] = value
  }

  return {
    filters,
    pagination: {
      pageIndex: parsePositiveInteger(search.page, 1) - 1,
      pageSize: parsePositiveInteger(search.size, 30),
    },
  }
}

export function toAssignementRuleTableSearch(
  state: AssignementRuleTableSearchState
): TableFilterSearch {
  return {
    ...state.filters,
    page: String(state.pagination.pageIndex + 1),
    size: String(state.pagination.pageSize),
  }
}
```

## 3. Unit Tests (`table-search.test.ts`)
- Test parsing default/empty search parameters (defaults to `pageIndex: 0`, `pageSize: 30`).
- Test parsing custom pagination and filters.
- Test serializing state to URL search parameters.

## Acceptance Criteria
- [ ] Conforms to `APPLICATION-ARCHITECTURE.md` (lives in `route-adapters/`, no React components, pure adapter logic).
- [ ] Works seamlessly with `@shared/tables`'s `TableFilterQueryParams` or `useTableFilterQueryParams`.
- [ ] Unit tests pass.
