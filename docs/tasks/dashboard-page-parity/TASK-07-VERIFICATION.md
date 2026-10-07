# Task 07 — test coverage and verification

Target: test suites, typecheck, lint, and architecture gates for the `/` dashboard page.

## Responsibilities

1. Feature unit tests:
   - `dashboard-service.test.ts`: test all 6 reporting methods (method, URL, query parameters, schemas).
   - `report-show-report-store.test.ts`: test Zustand store state and toggle.
   - `report-distribution-by-status.test.ts`: test pivot data mapping and filters handling.
   - `dashboard-pivot-table-toolbar.test.tsx` or `dashboard-page.test.tsx`: test component rendering, show report toggle, and tab switching.
2. Architecture & quality gates:
   - Run `pnpm architecture:check` to ensure no architecture boundary violations (import boundaries, legacy directories, etc.).
   - Run `pnpm --filter iap-admin typecheck`.
   - Run `pnpm --filter iap-admin lint`.
   - Run tests: `pnpm --filter iap-admin exec vitest run src/features/dashboard`.
   - Verify `git diff --check`.

## Acceptance criteria

- All newly created and updated tests pass without failures.
- Zero TypeScript, ESLint, or architecture check errors.
- Clean working directory with no stray or temporary files.
