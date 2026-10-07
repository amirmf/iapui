# Task 04 — report table header and toolbar

Reference:
- `insurance-ui/src/features/dashboard/components/dashboard-report-table-header.tsx`
- `insurance-ui/src/features/dashboard/components/dashboard-pivot-table-toolbar.tsx`
Target owners:
- `apps/iap-admin/src/features/dashboard/components/dashboard-report-table-header.tsx`
- `apps/iap-admin/src/features/dashboard/components/dashboard-pivot-table-toolbar.tsx`

## Responsibilities

1. `DashboardReportTableHeader`:
   - Match reference component interface:
     ```ts
     interface DashboardReportTableHeaderProps {
       isLoading: boolean
       onRefetch: () => Promise<unknown> | void
     }
     ```
   - Render outline button with spinner when `isLoading` is true, disabled while loading, with label `{t('dashboard.refresh')}`.
2. `DashboardPivotTableToolbar`:
   - Match reference component file name and implementation.
   - Use `GroupedTableFilterQueryParams` from `@shared/tables`.
   - Query doc types options via `useDocTypesData.optionsCode()` from `@modules/doc-types/queries/use-doc-types-data`.
   - Query status options via `getClaimRequestStatusOptions(t)` from `@features/claim-requests`.
   - Construct the 5 filter groups with exact IDs, titles, and configs:
     - `claim`: `status` (faceted), `docType.docTypeCode` (faceted), `submitDate` (dateRange), `createdAt` (dateTimeRange).
     - `assessment`: `latestAssignementDisplayName` (text), `latestAssignementUsername` (text numerical), `mainAssignedUserDisplayName` (text), `mainAssignedUserUsername` (text), `assessedAt` (dateTimeRange).
     - `policyholder`: `extPolicyId` (text numerical), `extContractId` (text numerical), `extPlanCaption` (text), `extCustomerId` (text), `extCustomerName` (text).
     - `organization`: `extWorkUnitName` (text), `extWorkUnitCode` (text numerical), `extWorkUnitCityName` (text), `extWorkUnitProvinceName` (text).
     - `financial`: `amount` (numberRange), `totalSumAmount` (numberRange).
   - Ignore `reportTab` in query params (`ignoreQueryParams={['reportTab']}`).
   - Pass `classNameContainer='mb-4'` and `showReset`.

## Acceptance criteria

- Component names and exported interfaces match reference.
- Filter groups and options match reference filter keys.
- Changing filters updates URL search params properly while ignoring `reportTab`.
