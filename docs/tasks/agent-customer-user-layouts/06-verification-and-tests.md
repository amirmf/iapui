# Task 06: Verification and Tests

## Objectives

1. Update `apps/iap-admin/src/shared/router/panel-routes.test.ts` to assert:
   - Panel route URLs match under `_agent` and `_customer-user` sibling groups (NOT under `_authenticated`).
   - `_agent` matches `/agent/**` without containing `_authenticated`.
   - `_customer-user` matches `/customer-user/**` without containing `_authenticated`.
   - Operations routes match under `_authenticated` without containing `_agent` or `_customer-user`.
2. Generate route tree: `pnpm --filter iap-admin build` or TanStack Router plugin generation.
3. Run test suite: `pnpm --filter iap-admin exec vitest run src/shared/router/panel-routes.test.ts`.
4. Run static validation:
   - `pnpm --filter iap-admin typecheck`
   - `pnpm --filter iap-admin lint`
   - `pnpm architecture:check`
   - `git diff --check`

## Execution Results

- **`vitest run src/shared/router/panel-routes.test.ts`**: Passed (9 tests passed). Sibling panel isolation and dynamic parameter matching verified.
- **`tsc -b` (typecheck)**: Passed (0 errors).
- **`eslint .` (lint)**: Passed (0 errors).
- **`pnpm architecture:check`**: Passed (`Architecture check passed`).
- **`pnpm --filter iap-admin build`**: Passed (Vite client build and `tsc -b` passed with 0 errors).
- **`git diff --check`**: Passed (0 whitespace or conflict errors).
