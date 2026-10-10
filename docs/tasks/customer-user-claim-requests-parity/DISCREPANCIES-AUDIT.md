# Customer user claim requests parity — exhaustive discrepancies audit

Target: `/customer-user/claim-requests/` in `iap-admin` (under `_customer-user` panel layout).
Reference: `insurance-ui/src/routes/customer-user/claim-requests/index.tsx` and `insurance-ui/src/features/customer-user/pages/customer-user-claim-requests-page.tsx`.

## 1. Executive summary

An exhaustive file-by-file, component-by-component, and line-by-line comparison between `insurance-ui` (reference) and `iap-admin` (target) reveals that:
1. The route in `iap-admin` (`/_customer-user/customer-user/claim-requests/index.tsx`) currently renders a `PlaceholderPage` instead of the actual `CustomerUserClaimRequestsPage`.
2. The entire `CustomerUserClaimRequestsPage` component tree and its supporting sub-components do not yet exist in `apps/iap-admin/src/features/customer-user/`.
3. Sibling page growth rules (`customer-user-panel` skill section 3 & `APPLICATION-ARCHITECTURE.md`) require organizing the `customer-user` feature into `pages/index/` (dashboard) and `pages/claim-requests/` (claim requests).
4. All required API endpoints, schemas (`@iap/api-types`), table primitives (`@shared/tables`), date utilities (`@iap/ui`), and Persian translations (`apps/iap-admin/src/shared/i18n/locales/fa/common.json`) exist in `iap-ui`.

---

## 2. Exhaustive component & file discrepancy breakdown

### Discrepancy 01: Route definition
- **Reference**: `insurance-ui/src/routes/customer-user/claim-requests/index.tsx`
  - `createFileRoute('/customer-user/claim-requests/')`
  - `component: CustomerUserClaimRequestsPage`
  - `loader: () => ({ crumb: 'claim' })`
- **Target current**: `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/index.tsx`
  - Mounts `PlaceholderPage` with `titleKey="sidebar.claimRequests"`.
- **Required Action**:
  - Replace `PlaceholderPage` with `CustomerUserClaimRequestsPage` imported from `@features/customer-user`.
  - Preserve `loader: () => ({ crumb: 'claim' })`.

---

### Discrepancy 02: Page layout & composition (`CustomerUserClaimRequestsPage`)
- **Reference**: `insurance-ui/src/features/customer-user/pages/customer-user-claim-requests-page.tsx`
  - Hooks: `useTranslation()`, `useCustomerUserClaimRequestColumns()`, `useSyncQueryParamsTableFilter()`, `useQuery()`.
  - Filter logic:
    - Default sort `createdAt asc`.
    - Fallback `quickStatus = 'IN_ASSESSMENT'`.
    - Skip current user check: `if (!ignoreSkipCurrentUserFilter.includes(quickStatus)) draft['skipCurrentUserFilter'] = 'Y'`.
    - Quick status application via `applyClaimRequestQuickStatusFilter(draft, quickStatus)`.
  - Query:
    - Query key: `['customerUserClaimRequests', pagination, effectiveFilters]`
    - Query fn: `claimRequestService.getPageLite({ page: pagination.pageIndex, size: pagination.pageSize, filters: effectiveFilters, signal })`
  - DOM structure:
    - Container: `<div className="pb-4">` wrapping `<Main>` (in `iap-admin`, layout shell already provides `<main>`, so `<section className="pb-4">` is used).
    - Header: `<div className="mb-6 flex flex-wrap items-center justify-between gap-4">` containing `<h1>` with `{t('customerUser.claimRequests.title')}` and `<CustomerUserClaimRequestHeaderActions>`.
    - Error banner: `{isError ? <p className="text-destructive">{t('common.errorStatus.generic')}</p> : null}`.
    - Content wrapper: `<div className="-mx-4 flex-1 overflow-auto px-4 py-1">` containing `<ClaimRequestDataTableToolbar>` and `<PaginatedDataTable>`.
    - Table properties: `tableWrapperClassName="max-h-130"`, `emptyStateText={t('customerUser.claimRequests.empty')}`, `manualSorting`, `enableSorting`.
- **Target current**: File is missing.
- **Required Action**:
  - Create `apps/iap-admin/src/features/customer-user/pages/claim-requests/customer-user-claim-requests-page.tsx` with identical composition, props, and styling.

---

### Discrepancy 03: Header actions component (`CustomerUserClaimRequestHeaderActions`)
- **Reference**: `insurance-ui/src/features/customer-user/components/customer-user-claim-request-header-actions.tsx`
  - Props: `{ isLoading: boolean; onRefetch: () => Promise<unknown> | void; filters: ApiFilterParams }`.
  - DOM: `<div className="flex flex-wrap gap-2">`.
  - Children:
    1. `<ClaimRequestExportExcelButton filters={filters} />`
    2. `<Button variant="outline" onClick={onRefetch} disabled={isLoading} className="space-x-2">`
       - `<IconRefresh size={18} className={isLoading ? 'animate-spin' : ''} />`
       - `<span>{t('claimRequests.refresh')}</span>`
- **Target current**: Component is missing.
- **Required Action**:
  - Create `apps/iap-admin/src/features/customer-user/pages/claim-requests/components/customer-user-claim-request-header-actions.tsx`.
  - Reuse `ClaimRequestExportExcelButton` from `@features/claim-requests`.
  - Use `Button` from `@iap/ui` and `IconRefresh` from `@tabler/icons-react`.

---

### Discrepancy 04: Table columns hook (`useCustomerUserClaimRequestColumns`)
- **Reference**: `insurance-ui/src/features/customer-user/components/customer-user-claim-request-columns.tsx`
  - Returns `ColumnDef<ClaimRequest>[]`.
  - 10 distinct columns:
    1. `extNationalCode`:
       - Header: `TwoLineHeader` (`claimRequests.columns.extNationalCode` / `claimRequests.columns.extMainNationalCode`).
       - Cell: `TwoLineCell` (`row.original.extNationalCode`, `row.original.extMainNationalCode`).
       - Link: `<Link to={customerUserClaimRoutes.management(id)} className="w-32 truncate text-sm text-primary underline">` when `id` exists.
       - Meta: `{ className: 'max-w-40' }`.
    2. `extDisplayName`:
       - Header: `TwoLineHeader` (`claimRequests.columns.extDisplayName` / `claimRequests.columns.extCustomerName`).
       - Cell: `TwoLineCell` (`row.original.extDisplayName`, `row.original.extCustomerName`, `longText: true`).
       - Meta: `{ className: 'max-w-40' }`.
    3. `businessKey`:
       - Header: `TwoLineHeader` (`claimRequests.columns.businessKey` / `claimRequests.columns.extPolicyId`).
       - Cell: `TwoLineCell` (`row.original.businessKey`, `row.original.extPolicyId`).
       - Meta: `{ className: 'max-w-40' }`.
    4. `docType.id`:
       - Accessor: `row.docType?.docType ?? row.documents?.flatMap(d => d?.documentType ?? []).filter(Boolean).join(', ') ?? ''`.
       - Header: `TwoLineHeader` (`claimRequests.columns.docType` / `claimRequests.columns.extPlanCaption`).
       - Cell: `TwoLineCell` (value, `row.original.extPlanCaption`, `longText: true`, `primaryClassName='max-w-60'`, `secondaryClassName='max-w-60 text-xs'`).
       - Meta: `{ className: 'max-w-40' }`.
    5. `amount`:
       - Header: `TwoLineHeader` (`claimRequests.columns.amount` / `claimRequests.columns.totalSumAmount`).
       - Cell: `TwoLineCell` (`amount?.toLocaleString('en-US')`, `totalSumAmount?.toLocaleString('en-US')`).
       - Meta: `{ className: 'max-w-30' }`.
    6. `status`:
       - Header: `TwoLineHeader` (`claimRequests.columns.status` / `claimRequests.columns.aiStatus`).
       - Cell: Status badge (`claimStatusColors[status]`) and AI Status badge (`aiStatusColors[aiStatus]`).
       - Sorting: `enableSorting: false`.
       - Meta: `{ className: 'max-w-52' }`.
    7. `submitDate`:
       - Header: `TwoLineHeader` (`claimRequests.columns.submitDate` / `claimRequests.columns.createdAt`).
       - Cell: `TwoLineCell` (`formatDate(submitDate)`, `formatDateTime(createdAt)`).
       - Meta: `{ className: 'max-w-48' }`.
    8. `latestAssignementDisplayName`:
       - Header: `TwoLineHeader` (`claimRequests.columns.latestAssignementDisplayName` / `claimRequests.columns.assessedAt`).
       - Cell: `TwoLineCell` (`latestAssignementDisplayName`, `formatDateTime(assessedAt)`, `longTextPrimary: true`).
       - Meta: `{ className: 'max-w-48' }`.
    9. `extPolicyId`:
       - Header: `TwoLineHeader` (`claimRequests.columns.extPolicyId` / `claimRequests.columns.extContractId`).
       - Cell: `TwoLineCell` (`extPolicyId`, `extContractId`).
       - Meta: `{ className: 'max-w-40' }`.
    10. `extWorkUnitName`:
        - Header: `TwoLineHeader` (`claimRequests.columns.extWorkUnitName` / `claimRequests.columns.isReturn`).
        - Cell: `TwoLineCell` (`extWorkUnitName`, `isReturn === 'Y' ? t('common.yes') : isReturn === 'N' ? t('common.no') : null`, `longTextPrimary: true`).
        - Meta: `{ className: 'max-w-48' }`.
- **Target current**: Hook is missing.
- **Required Action**:
  - Create `apps/iap-admin/src/features/customer-user/pages/claim-requests/components/customer-user-claim-request-columns.tsx`.

---

### Discrepancy 05: Route constants & URL helpers (`customerUserClaimRoutes`)
- **Reference**: `insurance-ui/src/features/customer-user/utils/customer-user-claim-routes.ts`
  - Defines `list` and `management` route paths.
- **Target current**: File is missing.
- **Required Action**:
  - Create `apps/iap-admin/src/features/customer-user/pages/claim-requests/utils/customer-user-claim-routes.ts`.

---

### Discrepancy 06: Status constants & colors (`customer-user-claim-constant.ts`)
- **Reference**: `insurance-ui/src/constants/claim-status-constant.ts`
  - Defines `claimStatusColors`, `aiStatusColors`, `CLAIM_REQUEST_STATUS_TRANSLATION_KEYS`, `CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS`, `ignoreSkipCurrentUserFilter`.
- **Target current**: Centralized constants exist in `@features/claim-requests/model/claim-request-status.ts` but are not localized in `customer-user`.
- **Required Action**:
  - Create `apps/iap-admin/src/features/customer-user/model/customer-user-claim-constant.ts` exporting these constants to eliminate direct cross-feature internals imports while maintaining strict architectural boundaries.

---

### Discrepancy 07: Table filter URL synchronization hook (`useSyncQueryParamsTableFilter`)
- **Reference**: `insurance-ui/src/components/data-table/filter/use-sync-query-params-table-filter.ts`
  - Synchronizes URL query parameters with React table pagination and sorting.
- **Target current**: File is missing in `customer-user`.
- **Required Action**:
  - Create `apps/iap-admin/src/features/customer-user/pages/claim-requests/route-adapters/use-sync-query-params-table-filter.ts`.

---

### Discrepancy 08: Feature folder structure reorganization
- **Reference & skill guidelines**:
  - `customer-user-panel` skill section 3:
    "When adding `/customer-user/claim-requests/**`:
    1. If the feature grows beyond the single root dashboard page, move the root page to `pages/index/` and create `pages/claim-requests/` in accordance with `APPLICATION-ARCHITECTURE.md`."
- **Target current**:
  - Single component `apps/iap-admin/src/features/customer-user/components/customer-user-dashboard-page.tsx`.
- **Required Action**:
  - Reorganize into `pages/index/` and `pages/claim-requests/` while preserving backward-compatible exports in `index.ts`.
