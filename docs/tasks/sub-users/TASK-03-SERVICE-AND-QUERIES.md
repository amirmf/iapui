# TASK-03: Service and Queries

## Objective
Create the HTTP service consuming backend endpoints via `@iap/api-client` and create corresponding TanStack Query hooks for server-state management.

## Reference Source
- `insurance-ui/src/features/sub-users/services/sub-user-service.ts`
- `insurance-ui/src/features/sub-users/components/sub-user-section.tsx`
- `insurance-ui/src/features/sub-users/components/sub-user-row-actions.tsx`
- `insurance-ui/src/features/sub-users/components/sub-user-form-dialog.tsx`
- `insurance-ui/src/features/sub-users/components/sub-user-release-assignments-dialog.tsx`

## Implementation Target
1. `apps/iap-admin/src/features/sub-users/services/sub-user-service.ts`
2. `apps/iap-admin/src/features/sub-users/queries/use-sub-users-query.ts`
3. `apps/iap-admin/src/features/sub-users/queries/use-sub-user-mutations.ts`

## Detailed Specifications

### 1. Service Methods (`sub-user-service.ts`)
```ts
const SUB_USERS_BASE_PATH = '/auth/sub-users'
const ASSIGNMENTS_RELEASE_PATH = '/claim-requests/assignments/release'

export const subUserService = {
  list(params?: Record<string, unknown>, signal?: AbortSignal): Promise<SubUser[]>
  listPage(params: { page?: number; size?: number; sort?: string; direction?: string; filters?: ApiFilterParams; signal?: AbortSignal }): Promise<PageSubUser>
  getById(id: string, signal?: AbortSignal): Promise<SubUser>
  create(payload: CreateSubUserPayload): Promise<SubUser>
  update(id: string, payload: UpdateSubUserPayload): Promise<SubUser>
  disable(id: string): Promise<SubUser>
  releaseAssignments(payload: ReleaseAssignmentsPayload): Promise<Record<string, number>>
}
```

### 2. TanStack Query Hooks
- `useSubUsersPageQuery(params)`: Uses queryKey `['sub-users', pagination, filters]`.
- `useSubUserByIdQuery(id, enabled)`: Uses queryKey `['sub-user', id]`.
- `useSubUserMutations()`:
  - `createMutation`: invalidates `['sub-users']`.
  - `updateMutation`: invalidates `['sub-users']`, `['sub-user', id]`.
  - `toggleStatusMutation`: calls `subUserService.disable(id)`, invalidates `['sub-users']`.
  - `releaseAssignmentsMutation`: calls `subUserService.releaseAssignments({ userId })`, invalidates `['sub-users']`.

## Acceptance Criteria
- [ ] No direct Axios usage; uses `getApiClient()`.
- [ ] All inputs validated via Zod schemas before submission and response validated after receipt.
- [ ] Queries pass `signal` for request cancellation.
- [ ] Correct query invalidation on mutation success.
