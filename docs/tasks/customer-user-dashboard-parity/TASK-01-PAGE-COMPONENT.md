# Task 01 — CustomerUserDashboardPage component parity

## Objective

Implement `CustomerUserDashboardPage` in `apps/iap-admin/src/features/customer-user/components/customer-user-dashboard-page.tsx` with full parity to `insurance-ui/src/features/customer-user/pages/customer-user-dashboard-page.tsx`.

## Details

1. **Imports**:
   - `Button, Tabs, TabsContent, TabsList, TabsTrigger` from `@iap/ui`
   - `useLocation, useRouter` from `@tanstack/react-router`
   - `useTranslation` from `react-i18next`
   - `ReportCountByAssigneeSummaryTable, ReportCountByAssigneeTable, ReportDistributionByStatusTable, ReportSumByAssigneeTable` from `@features/dashboard`
   - `type DashboardFilters` from `@iap/api-types`
2. **State & URL params**:
   - `const [isReportVisible, setIsReportVisible] = useState(false)`
   - `location = useLocation()`, `search = (location.search ?? {}) as Record<string, unknown>`, `filters = search as DashboardFilters`
   - `router = useRouter()`
   - `onValueChange`: navigate with `to: './'` or `to: '.'`, update `searchQuery['reportTab'] = value`, `replace: true`
3. **Render structure**:
   - `<section>` root wrapper
   - Header with `h1` styled as `'text-2xl font-bold tracking-tight'` with `{t('dashboard.title')}`
   - If `!isReportVisible`:
     - Centered `Button` invoking `setIsReportVisible(true)` with `{t('dashboard.reports.actions.showReport')}`
   - If `isReportVisible`:
     - `<Tabs dir='rtl' onValueChange={onValueChange} value={(filters['reportTab'] as string) || undefined} defaultValue='reportCountByAssigneeSummary' className='w-full'>`
     - `<TabsList className='grid h-auto w-full grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-4'>` (or `md:grid-cols-5` as in reference) with 4 triggers:
       - `reportCountByAssigneeSummary`
       - `reportCountByAssignee`
       - `reportSumByAssignee`
       - `reportDistributionByStatus`
     - 4 `<TabsContent>` blocks with respective table components receiving `filters` prop.

## Acceptance criteria

- Component renders without TypeScript or lint errors.
- Matches visual and functional behavior of the reference implementation.
