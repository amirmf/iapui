# Task 05 — test coverage and verification

## Objective
Add unit test coverage for the page, columns, header actions, and route adapters, and run all workspace quality gates.

## Execution details
1. **Unit Tests**:
   - `customer-user-claim-requests-page.test.tsx`:
     - Renders header title and actions
     - Passes pagination and filters to `claimRequestService.getPageLite`
     - Displays error state when query fails
     - Renders table with empty state when data is empty
     - Renders table rows when data is populated
   - `customer-user-claim-request-columns.test.tsx`:
     - Verifies column definitions, headers, formatting, and link generation
   - `customer-user-claim-request-header-actions.test.tsx`:
     - Verifies Excel export button presence and refetch trigger

2. **Quality Gates**:
   - `pnpm --filter iap-admin typecheck`: zero TypeScript errors
   - `pnpm --filter iap-admin lint`: zero ESLint errors
   - `pnpm architecture:check`: zero architecture boundary violations
   - `pnpm --filter iap-admin test`: all feature tests pass
   - `pnpm --filter iap-admin build`: production build succeeds
