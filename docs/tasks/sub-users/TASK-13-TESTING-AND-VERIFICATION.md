# TASK-13: Testing and Verification

## Objective
Verify the implementation with automated unit tests for schemas, stores, constants, forms, and services, and run TypeScript check, linting, and production build.

## Test Suite Scope

### 1. Schema & Contract Tests
- File: `packages/api-types/src/sub-user/sub-user-schema.test.ts`
- Tests:
  - Validates `subUserSchema` with complete and minimal payloads.
  - Verifies `pageSubUserSchema` parsing.
  - Rejects invalid IDs or malformed schemas.

### 2. Form Schema Tests
- File: `apps/iap-admin/src/features/sub-users/model/sub-user-form-schema.test.ts`
- Tests:
  - Validates username length and numeric requirement (10 digits).
  - Verifies doctor role exclusivity (`ROLE_DOCTOR_USER` cannot be combined with other roles).
  - Verifies password requirement during creation vs optional in update.

### 3. Store Tests
- File: `apps/iap-admin/src/features/sub-users/context/store/sub-user-store.test.ts`
- Tests:
  - Opening / closing dialogs and updating `currentRow`.
  - Updating `rowSelection` and `selectedUserAccount`.
  - Calling `reset()`.

### 4. Service Tests
- File: `apps/iap-admin/src/features/sub-users/services/sub-user-service.test.ts`
- Tests:
  - Mocks `getApiClient()` and verifies paths, HTTP methods, parameters, and payloads.

## Verification Checklist
- [x] `pnpm --filter @iap/api-types check-type`
- [x] `pnpm --filter iap-admin check-type`
- [x] `pnpm --filter iap-admin test` (runs vitest for sub-users and existing tests)
- [x] `pnpm lint`
- [x] `pnpm build`
