# Task 06 — root dashboard page and route parity

Reference: `insurance-ui/src/routes/_authenticated/index.tsx`, `insurance-ui/src/features/dashboard/index.tsx`.
Target owners:
- `apps/iap-admin/src/app/router/routes/_authenticated/index.tsx`
- `apps/iap-admin/src/features/dashboard/dashboard-page.tsx`
- `apps/iap-admin/src/features/dashboard/route-adapters/route-search-schema.ts`
- `apps/iap-admin/src/features/dashboard/index.ts`

## Responsibilities

1. Route definition and search validation:
   - In `apps/iap-admin/src/app/router/routes/_authenticated/index.tsx`:
     ```tsx
     import {
       DashboardPage,
       dashboardRouteSearchSchema,
     } from '@features/dashboard'
     import { createFileRoute } from '@tanstack/react-router'

     export const Route = createFileRoute('/_authenticated/')({
       component: DashboardPage,
       loader: () => ({
         crumb: 'dashboard',
       }),
       validateSearch: dashboardRouteSearchSchema,
     })
     ```
   - Route file remains thin, delegating to `DashboardPage`, validating search parameters with `dashboardRouteSearchSchema`, and declaring the `dashboard` breadcrumb.
2. Root page component (`DashboardPage`):
   - Check `useShowReport((state) => state.isShowReport)` and `useShowReport((state) => state.toggleShowReport)`.
   - If `!isShowReport`:
     - Render heading `{t('dashboard.title')}`.
     - Render centered button `{t('dashboard.reports.actions.showReport')}` triggering `toggleShowReport`.
   - If `isShowReport`:
     - Render heading `{t('dashboard.title')}`.
     - Render `<Tabs dir='rtl' onValueChange={onValueChange} value={(filters['reportTab'] as string) || undefined} defaultValue='reportCountByAssigneeSummary' className='w-full'>`.
     - 5 Tab triggers in exact reference order:
       1. `reportCountByAssigneeSummary`: `{t('dashboard.reports.tabs.reportCountByAssigneeSummary')}`
       2. `reportCountByAssignee`: `{t('dashboard.reports.tabs.reportCountByAssignee')}`
       3. `reportSumByAssignee`: `{t('dashboard.reports.tabs.reportSumByAssignee')}`
       4. `reportDistributionByStatus`: `{t('dashboard.reports.tabs.reportDistributionByStatus')}`
       5. `agreementsWithoutMainAssessmentUser`: `{t('dashboard.reports.tabs.agreementsWithoutMainAssessmentUser')}`
     - 5 Tab contents rendering the 5 individual report table components.
     - Handle `onValueChange` updating route search param `reportTab: value`.
3. Public feature export:
   - `apps/iap-admin/src/features/dashboard/index.ts` exports `DashboardPage` (and default if needed).

## Acceptance criteria

- Route tree passes typecheck with the new crumb loader.
- Tab selection and toggles reflect in the UI and URL identically to reference.
- Page rendering is lightweight and performs without redundant re-renders.
