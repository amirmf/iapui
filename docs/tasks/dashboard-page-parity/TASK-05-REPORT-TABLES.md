# Task 05 — individual report tables parity

Reference components:
- `insurance-ui/src/features/dashboard/components/report-count-by-assignee-summary-table.tsx`
- `insurance-ui/src/features/dashboard/components/report-count-by-assignee-table.tsx`
- `insurance-ui/src/features/dashboard/components/report-sum-by-assignee-table.tsx`
- `insurance-ui/src/features/dashboard/components/report-distribution-by-status-table.tsx`
- `insurance-ui/src/features/dashboard/utils/report-distribution-by-status.ts`
- `insurance-ui/src/features/dashboard/components/report-agreements-without-main-assessment-user-table.tsx`

Target files in `apps/iap-admin/src/features/dashboard/`:
- `components/report-count-by-assignee-summary-table.tsx`
- `components/report-count-by-assignee-table.tsx`
- `components/report-sum-by-assignee-table.tsx`
- `components/report-distribution-by-status-table.tsx`
- `utils/report-distribution-by-status.ts`
- `components/report-agreements-without-main-assessment-user-table.tsx`

## Responsibilities

1. Decompose aggregated components:
   - Split merged `assignee-report-table.tsx` into 3 separate, focused components:
     - `report-count-by-assignee-summary-table.tsx`: calls `dashboardService.reportCountByAssigneeSummary`, maps statuses with `APPROVED` override (`claimRequests.status.approvedSummery`), row header `assignedUserDisplayName`, column field `statusLabel`, value `count`, export `report-count-by-assignee-summary`.
     - `report-count-by-assignee-table.tsx`: calls `dashboardService.reportCountByAssignee`, standard status mapping, row header `assignedUserDisplayName`, column field `statusLabel`, value `count`, export `report-count-by-assignee`.
     - `report-sum-by-assignee-table.tsx`: calls `dashboardService.reportSumByAssignee`, row header `assignedUserDisplayName`, column field `statusLabel`, values `amount` & `totalSumAmount`, export `report-sum-by-assignee`.
2. Status distribution report table & util:
   - `utils/report-distribution-by-status.ts`:
     - `getDistributionReportFilters`: filters out `reportTab`.
     - `toStatusDistributionPivotData`: maps `reports` to pivot rows with `statusLabel`, `distributionLabel` (`t('dashboard.reports.columns.distribution')`), `count`, `amount`, `totalSumAmount`.
   - `components/report-distribution-by-status-table.tsx`: calls `dashboardService.reportDistributionByStatus`, row header `status`, column field `distributionLabel`, values `count`, `amount`, `totalSumAmount`, export `report-distribution-by-status`.
3. Agreements without main assessment user table:
   - `components/report-agreements-without-main-assessment-user-table.tsx`:
     - Calls `dashboardService.findAgreementsWithoutMainAssessmentUser`.
     - Query key: `['dashboard-agreements-without-main-assessment-user']`.
     - Uses `SimpleDataTable` with columns:
       - `extContractId`: TwoLineHeader/TwoLineCell (`extContractId` / `extPolicyId`).
       - `title`: TwoLineHeader/TwoLineCell (`title` / `extLocation`, longTextPrimary).
       - `code`: DataTableColumnHeader / font-mono text.
       - `status`: TwoLineHeader/TwoLineCell (`agreements.status.${status.toLowerCase()}` / `templateCode`).
       - `fromDate`: TwoLineHeader/TwoLineCell (`formatDateTime(fromDate)` / `formatDateTime(thruDate)`).
     - Empty text: `t('dashboard.reports.empty.agreementsWithoutMainAssessmentUser')`.
4. Stale/GC time conventions:
   - Preserve reference `staleTime: 10 * 60 * 1000` and `gcTime: 10 * 60 * 1000` across all queries.
5. Clean up replaced files:
   - Remove obsolete `assignee-report-table.tsx`, `distribution-report-table.tsx`, `agreements-report-table.tsx`, `dashboard-filters.tsx`, and `dashboard-report-header.tsx`.

## Acceptance criteria

- All 5 table component files exist with exact reference file names and exports.
- Components are small, single-responsibility, performant, and follow clean code patterns.
- Pivot tables and data table render identical structures to reference.
