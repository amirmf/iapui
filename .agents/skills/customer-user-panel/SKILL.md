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

## 3. Customer User Claim Requests (`/customer-user/claim-requests/`)

The Customer User Claim Requests page lists policyholder claim requests with pagination, sorting, status badges, and quick filters:

1. **Feature Structure & Placement**:
   - Page component: `apps/iap-admin/src/features/customer-user/pages/claim-requests/customer-user-claim-requests-page.tsx`
   - Header actions: `pages/claim-requests/components/customer-user-claim-request-header-actions.tsx`
   - Columns: `pages/claim-requests/components/customer-user-claim-request-columns.tsx`
   - Route adapter: `pages/claim-requests/route-adapters/use-sync-query-params-table-filter.ts`
   - Route constants: `pages/claim-requests/utils/customer-user-claim-routes.ts` (`list`, `management(id)`)
   - Constants & colors: `model/customer-user-claim-constant.ts`
   - Route file: `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/index.tsx`
   - Route loader: `loader: () => ({ crumb: 'claim' })`

2. **Reference Parity Details**:
   - **Header Actions**: Renders `<ClaimRequestExportExcelButton filters={filters} />` and refresh button with spinning `<IconRefresh size={18} />`.
   - **Columns (10 total)**: Two-line header and cell layout:
     1. `extNationalCode` / `extMainNationalCode`: links to `customerUserClaimRoutes.management(id)`.
     2. `extDisplayName` / `extCustomerName`: `longText` enabled.
     3. `businessKey` / `extPolicyId`.
     4. `docType.id` / `extPlanCaption`: accessor combines `docType?.docType` or `documents[*].documentType`.
     5. `amount` / `totalSumAmount`: formatted with `toLocaleString('en-US')`.
     6. `status` / `aiStatus`: badges styled with `claimStatusColors` and `aiStatusColors` using reference translation keys. Sorting disabled.
     7. `submitDate` / `createdAt`: formatted with `formatDate` and `formatDateTime`.
     8. `latestAssignementDisplayName` / `assessedAt`.
     9. `extPolicyId` / `extContractId`.
     10. `extWorkUnitName` / `isReturn`: translated with `common.yes` / `common.no`.
   - **URL Synchronization**: `useSyncQueryParamsTableFilter` synchronizes `page`, `size`, `sort`, and `direction` with router search params.
   - **Filter Logic**:
     - Default sort: `createdAt asc` if sort param missing or empty.
     - Fallback `quickStatus = 'IN_ASSESSMENT'`.
     - Skip current user check: `if (!ignoreSkipCurrentUserFilter.includes(quickStatus)) draft['skipCurrentUserFilter'] = 'Y'`.
     - Status application: calls `applyClaimRequestQuickStatusFilter(draft, quickStatus)`.
   - **Query**: TanStack Query with key `['customerUserClaimRequests', pagination, effectiveFilters]` calling `claimRequestService.getPageLite({ page, size, filters, signal })`.
   - **Table Composition**: Renders `<ClaimRequestDataTableToolbar count={data?.totalElements ?? undefined} />` and `<PaginatedDataTable />` with `tableWrapperClassName="max-h-130"` and `emptyStateText={t('customerUser.claimRequests.empty')}`.

## 4. Customer User Claim Request Management (`/customer-user/claim-requests/$claimRequestId/claim-request-management/`)

The Customer User Claim Request Management page provides a comprehensive detail view of a claim request for customer users:

1. **Route Architecture**:
   - Route path: `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/$claimRequestId.claim-request-management/index.tsx`
   - Route loader: Prefetches `customerUserClaimRequestQueryOptions(claimRequestId)` with `staleTime: 'static'` and returns `{ crumb: 'claim-request-management' }`.
   - Pending state: `ClaimRequestManagementPanelPending` (renders panel skeleton without operator action buttons).
   - Error state: `ClaimRequestManagementQueryError`.
   - Imports: Always import through public feature API `@features/customer-user`.

2. **Hook & Query Architecture**:
   - Query options: `customerUserClaimRequestQueryOptions(claimRequestId)`
   - Query key: `['customerUserClaimRequest', claimRequestId]`
   - Service call: `claimRequestService.getById(claimRequestId, { signal })`
   - Custom hook: `useCustomerUserClaimRequest(claimRequestId)` returning standard TanStack Query result.

3. **Page Composition & Layout (`customer-user-claim-request-management-page.tsx`)**:
   - Wrapper: `<Main className='space-y-4 bg-transparent p-0 shadow-none sm:p-0'>`
   - Top Header Section:
     - `ClaimRequestLastStatusSection` with `statusHistory`, `status`, `extPaymentDate`.
     - `ClaimRequestAssignSection` with `claimRequest`.
   - Info List:
     - `ClaimRequestInfoList` with `data`, `refetch`, and `viewDetailsAdjustmentLink` set to `'/agent/claim-requests/$claimRequestId/claim-request-management'`.
   - Body Grid (50/50 on md, 40/60 on lg):
     - Left column: `<Card><CardContent className='px-4'>` hosting:
       - `ClaimRequestAssessmentItemsSection`
       - `ClaimRequestDoctorResponses`
       - `ClaimRequestDuplicatedSection`
       - `ClaimRequestManagementError`
       - `ClaimRequestObjectionSection`
     - Right column: `ClaimRequestAttachmentsSection`
   - History & Documents:
     - `ClaimRequestManagementPrevRequest` rendered conditionally when `claimRequest.createdBy` exists.
     - `ClaimRequestDocumentsSection` with `claimRequestId` and `documents`.

4. **Feature Boundaries**:
   - Customer-user pages must never import from `@features/agent-claim-requests` or vice versa.
   - Guarded by automated test `customer-user-import-boundary.test.ts`.

## 5. Verification Checklist

Whenever modifying customer-user panel code:
1. `pnpm --filter iap-admin typecheck` (zero TypeScript errors)
2. `pnpm --filter iap-admin lint` (zero ESLint errors)
3. `pnpm architecture:check` (verifies architectural constraints)
4. `pnpm --filter iap-admin test src/features/customer-user src/shared/router/panel-routes.test.ts`
5. `pnpm --filter iap-admin build` (production build succeeds)
