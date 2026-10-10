---
name: customer-user-panel
description: Guide for implementing, extending, and maintaining customer-user panel routes and pages in iap-admin with exact reference parity to insurance-ui and aligned with application architecture.
---

# Customer-User Panel Architecture & Pages

Use this skill when implementing, extending, or maintaining routes and pages within the `_customer-user` panel partition (`/customer-user/**`) in `apps/iap-admin` with exact reference parity to `insurance-ui` and full compliance with `docs/architecture/APPLICATION-ARCHITECTURE.md`.

## 1. Panel Partition Architecture

The Customer-User Panel is an isolated layout partition for policyholders / customer representatives:

1. **Pathless Layout Group**:
   - Route root: `apps/iap-admin/src/app/router/routes/_customer-user/route.tsx`
   - Layout: `CustomerUserLayout` from `@shared/app-shell/customer-user-layout`
   - Guard: `beforeLoadAuth` from `@iap/auth`
   - URL prefix: `/customer-user/**` (e.g. `/customer-user/`, `/customer-user/claim-requests/`)
   - Header home page URL: `/customer-user/`
   - Sidebar navigation: `customerUserNavigation` (`sidebar.dashboard`, `customerUser.claimRequests.nav`)

2. **Route Boundaries**:
   - All customer-user routes live under `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/`.
   - Never place customer-user routes under `_authenticated` (operations panel) or `_agent` (agent panel).
   - Route files must remain thin: declare route, loader with breadcrumb metadata, and delegate to the feature's public API.

## 2. Customer User Dashboard (`/customer-user/`)

The Customer User Dashboard provides high-level claim aggregation reports tailored for customer users:

1. **Feature Placement**:
   - Feature directory: `apps/iap-admin/src/features/customer-user/`
   - Single-root page component: `components/customer-user-dashboard-page.tsx`
   - Public API: `index.ts` re-exporting `CustomerUserDashboardPage`
   - Route: `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/index.tsx`
   - Breadcrumb loader: `loader: () => ({ crumb: 'dashboard' })`

2. **Reference Parity Details**:
   - **Local Visibility State**: Unlike the operations dashboard which uses Zustand `useShowReport`, `CustomerUserDashboardPage` uses local `useState(false)` (`isReportVisible`) matching reference.
   - **Report Tabs**: Contains exactly 4 reporting tabs (omitting the operations-only `agreementsWithoutMainAssessmentUser` tab):
     1. `reportCountByAssigneeSummary` ➡️ `ReportCountByAssigneeSummaryTable`
     2. `reportCountByAssignee` ➡️ `ReportCountByAssigneeTable`
     3. `reportSumByAssignee` ➡️ `ReportSumByAssigneeTable`
     4. `reportDistributionByStatus` ➡️ `ReportDistributionByStatusTable`
   - **Table Reuse**: The 4 report tables are imported directly from `@features/dashboard`.
   - **Reactive Search Params**: Read `filters` using `useLocation().search` as `DashboardFilters` to ensure reactive tab/filter updates, and navigate tab switches with `router.navigate({ to: './', replace: true, search: ... })`.
   - **Layout Root**: Render inside a `<section>` container (avoiding duplicate `<main>` landmarks within `CustomerUserLayout`).

## 3. Sibling Pages Growth (Claim Requests)

When adding `/customer-user/claim-requests/**`:
1. If the feature grows beyond the single root dashboard page, move the root page to `pages/index/` and create `pages/claim-requests/` in accordance with `APPLICATION-ARCHITECTURE.md`.
2. Ensure endpoint calls remain scoped to customer-user permissions and never mix operations endpoints.
3. Preserve breadcrumb sequence and panel layout ancestry in `src/shared/router/panel-routes.test.ts`.

## 4. Verification Checklist

Whenever modifying customer-user panel code:
1. `pnpm --filter iap-admin typecheck` (zero TypeScript errors)
2. `pnpm --filter iap-admin lint` (zero ESLint errors)
3. `pnpm architecture:check` (verifies architectural constraints)
4. `pnpm --filter iap-admin test src/features/customer-user/customer-user-dashboard-page.test.tsx src/shared/router/panel-routes.test.ts`
5. `pnpm --filter iap-admin build` (production build succeeds)
