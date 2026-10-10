# Task 01 — page structure reorganization

## Objective
Reorganize `apps/iap-admin/src/features/customer-user/` to accommodate sibling page journeys (`pages/index/` and `pages/claim-requests/`) in accordance with `customer-user-panel` skill section 3 and `APPLICATION-ARCHITECTURE.md`.

## Execution details
1. Move `CustomerUserDashboardPage` from `components/customer-user-dashboard-page.tsx` to `pages/index/customer-user-dashboard-page.tsx` (or keep backward-compatible re-export from `components/`).
2. Move `customer-user-dashboard-page.test.tsx` to `pages/index/customer-user-dashboard-page.test.tsx`.
3. Create `pages/claim-requests/` directory structure:
   - `pages/claim-requests/components/`
   - `pages/claim-requests/route-adapters/`
   - `pages/claim-requests/utils/`
   - `pages/claim-requests/queries/`
4. Update `apps/iap-admin/src/features/customer-user/index.ts` to export both `CustomerUserDashboardPage` and `CustomerUserClaimRequestsPage`.
5. Verify that `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/index.tsx` continues to work with zero regressions.
