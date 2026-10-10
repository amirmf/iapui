# Customer user dashboard — comprehensive discrepancies and parity audit

Comparing `insurance-ui/src/features/customer-user/pages/customer-user-dashboard-page.tsx` & `src/routes/customer-user/index.tsx`
with `iap-admin` in `iap-ui`.

## Line-by-line itemized discrepancies

### 1. Feature existence and component placement
- **Reference**: Located in `src/features/customer-user/pages/customer-user-dashboard-page.tsx`.
- **Target**: `apps/iap-admin/src/features/customer-user/` does not exist yet.
- **Action**: Create `apps/iap-admin/src/features/customer-user/components/customer-user-dashboard-page.tsx` conforming to `APPLICATION-ARCHITECTURE.md` (single root page feature convention).
- **Public API**: Create `apps/iap-admin/src/features/customer-user/index.ts` exporting `CustomerUserDashboardPage`.

### 2. Route wiring
- **Reference**: `src/routes/customer-user/index.tsx` mounts `CustomerUserDashboardPage` and defines `loader: () => ({ crumb: 'dashboard' })`.
- **Target**: `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/index.tsx` currently renders `() => <PlaceholderPage titleKey='sidebar.dashboard' />`.
- **Action**: Replace `PlaceholderPage` with `CustomerUserDashboardPage` from `@features/customer-user`, preserving `loader: () => ({ crumb: 'dashboard' })`.

### 3. Visibility state management
- **Reference**: Uses local React state `const [isReportVisible, setIsReportVisible] = useState(false)` (lines 21, 46, 99). Unlike `DashboardPage` which uses the Zustand store `useShowReport`, `CustomerUserDashboardPage` uses local state.
- **Target**: Must use local `useState(false)` to match reference behavior exactly.

### 4. Title and initial state
- **Reference**:
  - Heading: `<h1 className='text-2xl font-bold tracking-tight'>{t('dashboard.title')}</h1>`
  - Button when `!isReportVisible`:
    ```tsx
    <div className='flex items-center justify-center'>
      <Button onClick={() => setIsReportVisible(true)}>
        {t('dashboard.reports.actions.showReport')}
      </Button>
    </div>
    ```
- **Target**: Replicate exact DOM structure, Tailwind classes, and translations.

### 5. Tabs list and triggers
- **Reference**:
  - Container: `<Tabs dir='rtl' onValueChange={onValueChange} value={(filters['reportTab'] as string) || undefined} defaultValue='reportCountByAssigneeSummary' className='w-full'>`
  - List: `<TabsList className='grid h-auto w-full grid-cols-1 gap-2 md:grid-cols-5'>`
  - Triggers (4 triggers with exact styling):
    - `value='reportCountByAssigneeSummary'`: `{t('dashboard.reports.tabs.reportCountByAssigneeSummary')}`
    - `value='reportCountByAssignee'`: `{t('dashboard.reports.tabs.reportCountByAssignee')}`
    - `value='reportSumByAssignee'`: `{t('dashboard.reports.tabs.reportSumByAssignee')}`
    - `value='reportDistributionByStatus'`: `{t('dashboard.reports.tabs.reportDistributionByStatus')}`
  - Trigger class: `'transition-colors duration-300 ease-in-out data-[state=active]:bg-primary-500 data-[state=active]:text-muted dark:data-[state=active]:bg-background'`
- **Target**: Match all triggers, default value, and styling. Note: 4 triggers are present (omitting operations-only 5th tab `agreementsWithoutMainAssessmentUser`).

### 6. Tabs content mapping
- **Reference**:
  - `TabsContent value='reportCountByAssignee'` -> `<ReportCountByAssigneeTable filters={filters} />`
  - `TabsContent value='reportCountByAssigneeSummary'` -> `<ReportCountByAssigneeSummaryTable filters={filters} />`
  - `TabsContent value='reportSumByAssignee'` -> `<ReportSumByAssigneeTable filters={filters} />`
  - `TabsContent value='reportDistributionByStatus'` -> `<ReportDistributionByStatusTable filters={filters} />`
- **Target**: Render identical `TabsContent` blocks reusing the tested table components from `@features/dashboard`.

### 7. URL query synchronization
- **Reference**: Uses `useSyncQueryParamsTableFilter()` and `router.navigate({ to: '.', replace: true, search: ... })`.
- **Target**: In `iap-admin`, read `filters` via `useLocation().search` as `DashboardFilters` for reactive TanStack Router search param sync, and navigate via `router.navigate({ to: './', replace: true, search: ... })`.

### 8. Layout boundary
- **Reference**: Wraps page in `<Main>`.
- **Target**: `CustomerUserLayout` already provides `<main id='main-content'>`. Page root uses `<section>` to avoid nested `<main>` tags.

### 9. Translations verification
- `dashboard.title`: "داشبورد"
- `dashboard.reports.actions.showReport`: "نمایش گزارش"
- `dashboard.reports.tabs.reportCountByAssigneeSummary`: "تعداد پرونده‌ها به تفکیک کارشناس (خلاصه)"
- `dashboard.reports.tabs.reportCountByAssignee`: "تعداد پرونده‌ها به تفکیک کارشناس"
- `dashboard.reports.tabs.reportSumByAssignee`: "مبلغ پرونده‌ها به تفکیک کارشناس"
- `dashboard.reports.tabs.reportDistributionByStatus`: "توزیع پرونده‌ها به تفکیک وضعیت"
- `breadcrumb.dashboard`: "داشبورد"
- All verified present in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.
