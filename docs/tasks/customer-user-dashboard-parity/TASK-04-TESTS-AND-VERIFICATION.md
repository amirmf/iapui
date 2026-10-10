# Task 04 — Test coverage and verification

## Objective

Add unit tests for `CustomerUserDashboardPage` and verify all quality gates pass.

## Details

1. **Unit tests**:
   - Location: `apps/iap-admin/src/features/customer-user/customer-user-dashboard-page.test.tsx`
   - Test cases:
     - Initial render shows heading and "show report" button.
     - Clicking "show report" button reveals tabs.
     - Displays all 4 tabs (`reportCountByAssigneeSummary`, `reportCountByAssignee`, `reportSumByAssignee`, `reportDistributionByStatus`).
     - Switching tabs triggers `router.navigate` with updated `reportTab` search parameter.
     - Does NOT render the 5th operations-only tab (`agreementsWithoutMainAssessmentUser`).
2. **Quality checks**:
   - `pnpm --filter iap-admin typecheck`
   - `pnpm --filter iap-admin lint`
   - `pnpm --filter iap-admin test` (focused tests on customer-user and panel routes)
   - `pnpm architecture:check` or root checks

## Acceptance criteria

- All unit tests pass.
- No TypeScript or ESLint errors.
- `src/shared/router/panel-routes.test.ts` passes.
