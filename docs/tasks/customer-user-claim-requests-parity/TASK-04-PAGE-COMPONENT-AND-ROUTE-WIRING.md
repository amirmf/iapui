# Task 04 — page component and route wiring

## Objective
Implement `CustomerUserClaimRequestsPage` and connect it to TanStack Router at `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/index.tsx`.

## Execution details
1. **`CustomerUserClaimRequestsPage`**:
   - Location: `apps/iap-admin/src/features/customer-user/pages/claim-requests/customer-user-claim-requests-page.tsx`
   - Parity with `insurance-ui/src/features/customer-user/pages/customer-user-claim-requests-page.tsx`:
     - Calls `useTranslation()`
     - Calls `useCustomerUserClaimRequestColumns()`
     - Calls `useSyncQueryParamsTableFilter()`
     - Computes `effectiveFilters`:
       - Default sort `createdAt asc`
       - Fallback `quickStatus = 'IN_ASSESSMENT'`
       - Sets `skipCurrentUserFilter = 'Y'` when status is not in `ignoreSkipCurrentUserFilter`
       - Applies `applyClaimRequestQuickStatusFilter(draft, quickStatus)`
     - Uses TanStack Query `useQuery`:
       - Key: `['customerUserClaimRequests', pagination, effectiveFilters]`
       - Fn: `claimRequestService.getPageLite({ page: pagination.pageIndex, size: pagination.pageSize, filters: effectiveFilters, signal })`
     - Renders container: `<section className="pb-4">`
     - Renders header: Title `customerUser.claimRequests.title` and `CustomerUserClaimRequestHeaderActions`
     - Renders error state when `isError` is true: `<p className="text-destructive">{t('common.errorStatus.generic')}</p>`
     - Renders `ClaimRequestDataTableToolbar` with `count={data?.totalElements}` and `isLoading`
     - Renders `PaginatedDataTable` with columns, data (`claimRequests`), loading state, page count, total count, pagination, sorting handlers, `manualSorting`, `enableSorting`, `emptyStateText={t('customerUser.claimRequests.empty')}`, and `tableWrapperClassName="max-h-130"`.

2. **Public Feature API**:
   - Location: `apps/iap-admin/src/features/customer-user/index.ts`
   - Re-exports `CustomerUserClaimRequestsPage` from `pages/claim-requests/customer-user-claim-requests-page`.

3. **Route Wiring**:
   - Location: `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/index.tsx`
   - Imports `CustomerUserClaimRequestsPage` from `@features/customer-user`
   - Connects `component: CustomerUserClaimRequestsPage`
   - Retains `loader: () => ({ crumb: 'claim' })`.
