# Dashboard Reference Parity — Comprehensive Discrepancies Audit

Detailed, line-by-line audit between reference (`insurance-ui`) and current implementation (`iap-admin`).

## 1. Route boundary (`src/routes/_authenticated/index.tsx`)

| Aspect | Reference (`insurance-ui`) | Current target (`iap-admin`) | Discrepancy & Action |
| --- | --- | --- | --- |
| Route loader | `loader: () => ({ crumb: 'dashboard' })` | None | **Missing breadcrumb**: Add `crumb: 'dashboard'` to route loader. |
| Component import | Default import `Dashboard from '@/features/dashboard'` | Named import `DashboardPage from '@features/dashboard'` | Export both named `DashboardPage`, `Dashboard`, and `default` for flexibility while keeping route thin. |

---

## 2. Page root composition (`src/features/dashboard/index.tsx`)

| Aspect | Reference (`insurance-ui`) | Current target (`iap-admin`) | Discrepancy & Action |
| --- | --- | --- | --- |
| Component name & file | `index.tsx` (exports `Dashboard`) | `components/dashboard-page.tsx` (`DashboardPage`) | Align naming so `Dashboard` / `DashboardPage` match. |
| State ownership | Zustand store `useShowReport` from `context/report-show-report.ts` | Local `useState(false)` in component | **State regression**: Must use Zustand store `useShowReport` in `context/store/report-show-report-store.ts`. |
| Sub-components | 5 individual table components mounted under `<TabsContent>` | Merged wrapper `DashboardReports` with aggregated `AssigneeReportTable` | **Over-abstraction**: Remove wrapper and render the 5 separate table components under their respective tabs. |
| Props passed to tables | Only `filters={filters}` passed to tables | `filters`, `kind`, `onFiltersChange` passed to tables | **Prop mismatch**: Remove `onFiltersChange` and `kind` props. Tables only receive `filters` (or no props for agreements table). |
| Tab identifiers & order | 1. `reportCountByAssigneeSummary`<br>2. `reportCountByAssignee`<br>3. `reportSumByAssignee`<br>4. `reportDistributionByStatus`<br>5. `agreementsWithoutMainAssessmentUser` | Same IDs, but using different sub-components | Preserve exact tab IDs, default value `reportCountByAssigneeSummary`, and tab labels. |
| URL search update | `onValueChange` updates `searchQuery['reportTab'] = value` | Custom `setReportTab` wrapper around custom `setFilters` | Simplify to match reference navigation semantics directly. |

---

## 3. Header component (`src/features/dashboard/components/dashboard-report-table-header.tsx`)

| Aspect | Reference (`insurance-ui`) | Current target (`iap-admin`) | Discrepancy & Action |
| --- | --- | --- | --- |
| File name | `dashboard-report-table-header.tsx` | `dashboard-report-header.tsx` | **Name mismatch**: Rename to `dashboard-report-table-header.tsx`. |
| Prop interface | `{ isLoading: boolean; onRefetch: () => Promise<unknown> \| void }` | `{ isFetching?: boolean; onRefresh: () => void }` | **Interface mismatch**: Change props to `isLoading` and `onRefetch`. |
| Icon | `IconRefresh` with `animate-spin` when loading | `RotateCw` icon | Use Tabler/Lucide refresh icon with spinning animation on `isLoading`. |

---

## 4. Toolbar component (`src/features/dashboard/components/dashboard-pivot-table-toolbar.tsx`)

| Aspect | Reference (`insurance-ui`) | Current target (`iap-admin`) | Discrepancy & Action |
| --- | --- | --- | --- |
| File name | `dashboard-pivot-table-toolbar.tsx` | `dashboard-filters.tsx` | **Name mismatch**: Rename to `dashboard-pivot-table-toolbar.tsx`. |
| Underlying component | `GroupedTableFilterQueryParams` with 5 groups | `TableFilters` with flat lists | **Complete divergence**: Rewrite using `GroupedTableFilterQueryParams` with the exact 5 filter groups. |
| Group 1: `claim` | `status` (faceted: `getClaimRequestStatusOptions(t)`), `docType.docTypeCode` (faceted: `options`), `submitDate` (dateRange), `createdAt` (dateTimeRange) | Hardcoded status array in `dashboard-filters.tsx` | Use `getClaimRequestStatusOptions(t)` and `useDocTypesData.optionsCode()`. |
| Group 2: `assessment` | `latestAssignementDisplayName`, `latestAssignementUsername`, `mainAssignedUserDisplayName`, `mainAssignedUserUsername`, `assessedAt` | Part of flat text filters | Group under `assessment` with exact keys and date-time range. |
| Group 3: `policyholder` | `extPolicyId`, `extContractId`, `extPlanCaption`, `extCustomerId`, `extCustomerName` | Part of flat text filters | Group under `policyholder`. |
| Group 4: `organization` | `extWorkUnitName`, `extWorkUnitCode`, `extWorkUnitCityName`, `extWorkUnitProvinceName` | Part of flat text filters | Group under `organization`. |
| Group 5: `financial` | `amount` (numberRange), `totalSumAmount` (numberRange) | Flat numberRangeFilters | Group under `financial`. |
| Filter synchronization | Managed via URL query params (`ignoreQueryParams: ['reportTab']`, `showReset: true`) | Managed via local state and custom `onChange` updater | Use `GroupedTableFilterQueryParams` with `ignoreQueryParams={['reportTab']}`. |

---

## 5. Report tables breakdown

### 5.1. `report-count-by-assignee-table.tsx`
- **Reference**: Distinct component calling `dashboardService.reportCountByAssignee`, filtering out `reportTab`, queryKey `['dashboard-report-count-by-assignee', finalFilters]`, pivot value `count`, export `report-count-by-assignee`.
- **Target**: Was bundled inside `assignee-report-table.tsx`.
- **Action**: Extract dedicated `report-count-by-assignee-table.tsx` matching reference.

### 5.2. `report-count-by-assignee-summary-table.tsx`
- **Reference**: Distinct component calling `dashboardService.reportCountByAssigneeSummary`, queryKey `['dashboard-report-count-by-assignee-summary', finalFilters]`, status mapping override `APPROVED` -> `claimRequests.status.approvedSummery` ("ارزیابی شده"), pivot value `count`, export `report-count-by-assignee-summary`.
- **Target**: Was bundled inside `assignee-report-table.tsx` with generic logic.
- **Action**: Create dedicated `report-count-by-assignee-summary-table.tsx` with exact status translation override.

### 5.3. `report-sum-by-assignee-table.tsx`
- **Reference**: Distinct component calling `dashboardService.reportSumByAssignee`, queryKey `['dashboard-report-sum-by-assignee', finalFilters]`, pivot values `amount` and `totalSumAmount`, export `report-sum-by-assignee`.
- **Target**: Was bundled inside `assignee-report-table.tsx`.
- **Action**: Create dedicated `report-sum-by-assignee-table.tsx`.

### 5.4. `report-distribution-by-status-table.tsx` and `utils/report-distribution-by-status.ts`
- **Reference**: Dedicated table and utility mapping `StatusDistributionReport` to `StatusDistributionPivotData`. Pivot columns: row `statusLabel`, column `distributionLabel`, values `count`, `amount`, `totalSumAmount`.
- **Target**: Was named `distribution-report-table.tsx` without the separate utility file.
- **Action**: Create `utils/report-distribution-by-status.ts` and `components/report-distribution-by-status-table.tsx` matching reference.

### 5.5. `report-agreements-without-main-assessment-user-table.tsx`
- **Reference**: Calls `dashboardService.findAgreementsWithoutMainAssessmentUser({ signal })`, queryKey `['dashboard-agreements-without-main-assessment-user']`. Uses `SimpleDataTable` with TwoLineHeader/TwoLineCell columns (`extContractId`/`extPolicyId`, `title`/`extLocation`, `code`, `status`/`templateCode`, `fromDate`/`thruDate`).
- **Target**: Was named `agreements-report-table.tsx` and lacked the full two-line cell formatting.
- **Action**: Rename and update columns to match reference formatting and column titles.

---

## 6. Service signatures (`dashboard-service.ts`)

| Operation | Reference signature | Current target signature | Discrepancy & Action |
| --- | --- | --- | --- |
| `findAgreementsWithoutMainAssessmentUser` | `(options?: { signal?: AbortSignal }) => Promise<...>` | `(signal?: AbortSignal) => Promise<...>` | Support `options?: { signal?: AbortSignal }` or `{ signal }` object. |
| Report methods | `params: { filters: ReportFilters; signal?: AbortSignal }` | `options: RequestOptions` | Parameter object is compatible `{ filters, signal }`. Ensure `export default dashboardService` is also present. |

---

## 7. Localization (`common.json`)

| Key | Reference value | Current target status | Action |
| --- | --- | --- | --- |
| `claimRequests.status.approvedSummery` | `"ارزیابی شده"` | Missing | Add to `common.json`. |
| `dashboard.reports.filterGroups.claim` | `"اطلاعات درخواست"` | Missing | Add to `common.json`. |
| `dashboard.reports.filterGroups.assessment` | `"ارزیابی"` | Missing | Add to `common.json`. |
| `dashboard.reports.filterGroups.policyholder` | `"بیمه‌گذار و بیمه‌نامه"` | Missing | Add to `common.json`. |
| `dashboard.reports.filterGroups.organization` | `"سازمان و شعبه"` | Missing | Add to `common.json`. |
| `dashboard.reports.filterGroups.financial` | `"مالی"` | Missing | Add to `common.json`. |
| `dashboard.reports.filters.assignedUserUsername` | `"کدملی ارزیاب"` | Missing | Add to `common.json`. |
| `dashboard.reports.filters.assignedUserDisplayName` | `"نام ارزیاب"` | Missing | Add to `common.json`. |
| `dashboard.reports.columns.assignedUserUsername` | `"کدملی ارزیاب"` | Missing | Add to `common.json`. |
| `dashboard.reports.columns.docType` | `"نوع سند"` | Missing | Add to `common.json`. |
| `dashboard.reports.errors.agreementsWithoutMainAssessmentUser` | `"بارگذاری قراردادهای بدون ارزیاب اصلی ناموفق بود."` | Missing | Add to `common.json`. |
| `dashboard.reports.statuses.*` | Not in reference (uses `claimRequests.status.*`) | Present as duplicate | Remove duplicate keys and use centralized constant. |
