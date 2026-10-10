# Task 06: Verification, Unit Tests, and Build Checks

## Objective
Verify the implementation with targeted unit tests, linting, typechecking, and production build.

## Test Scope
1. Unit tests for `pre-auth-card.tsx`:
   - Formats amounts and dates correctly.
   - Applies correct status color class and translation key.
2. Unit tests for `pre-auth-filter.tsx`:
   - Updates form values and triggers `onApply` and `onClear`.
3. Route test in `apps/iap-app/src/shared/router/customer-routes.test.ts`:
   - Verifies route matching for `/pre-auths/`.
4. Run project gates:
   - `pnpm --filter @iap/api-types typecheck`
   - `pnpm --filter iap-app test`
   - `pnpm --filter iap-app typecheck`
   - `pnpm --filter iap-app lint`
   - `pnpm --filter iap-app build`
