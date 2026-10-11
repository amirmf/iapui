---
name: dashboard-pivot-reporting-pages
description: Guide and best practices for building dashboard, analytics, and pivot table reporting pages with grouped filters, deferred query execution, and TanStack Router search param synchronization.
---

# Dashboard & Pivot Reporting Pages Pattern

Use this skill when implementing or refactoring dashboard, analytics, or multi-tab reporting pages that feature aggregated reports, pivot tables, grouped search filters, and reactive router synchronization.

## 1. Architectural Layout & Decomposition

A reporting dashboard should never cram multiple large queries or tables into a single monolithic component. Instead, decompose it into focused, single-responsibility layers:

```
src/features/<feature>/
├── <feature>-page.tsx                      # Root page: deferred execution toggle, tabs layout, search param binding
├── components/
│   ├── <feature>-report-table-header.tsx        # Common header: refresh button with spin state
│   ├── <feature>-pivot-table-toolbar.tsx       # Grouped multi-category filter toolbar
│   ├── report-<metric-a>-table.tsx             # Focused report table A
│   ├── report-<metric-b>-table.tsx             # Focused report table B
│   └── report-<entity>-table.tsx               # Simple/dense data table (e.g. TwoLineCell)
├── context/
│   └── store/report-show-report-store.ts       # Zustand store for deferred report execution
├── route-adapters/
│   └── route-search-schema.ts                  # TanStack Router search schema validation
├── services/
│   └── <feature>-service.ts                    # Typed API reporting endpoints with AbortSignal support
└── utils/
    └── report-<metric>-helpers.ts              # Pure data mappers (API payload -> PivotData[])
```

## 2. Deferred Report Execution (Performance Protection)

Reporting queries are computationally expensive on the backend and database. To protect initial page loading and prevent unwanted query execution:

1. **Lightweight Zustand Toggle Store:**
   ```ts
   // context/store/report-show-report-store.ts
   import { create } from 'zustand'

   export interface ShowReportState {
     isShowReport: boolean
     toggleShowReport: () => void
   }

   export const useShowReport = create<ShowReportState>((set) => ({
     isShowReport: false,
     toggleShowReport: () => set((state) => ({ isShowReport: !state.isShowReport })),
   }))
   ```

2. **Initial Gate in Page Component:**
   ```tsx
   if (!isShowReport) {
     return (
       <section>
         <div className='mb-6 flex items-center justify-between'>
           <h1 className='text-2xl font-bold tracking-tight'>{t('dashboard.title')}</h1>
         </div>
         <div className='flex items-center justify-center'>
           <Button onClick={toggleShowReport}>
             {t('dashboard.reports.actions.showReport')}
           </Button>
         </div>
       </section>
     )
   }
   ```

## 3. Reactive Routing & Tab Synchronization

1. **Use `useLocation` for Reactive Search Params:**
   Always subscribe to search changes using `useLocation()` from `@tanstack/react-router` so that tab switches and filter modifications trigger reactive re-renders:
   ```tsx
   const router = useRouter()
   const location = useLocation()
   const filters = (location.search ?? {}) as DashboardFilters
   ```

2. **Tab Change Navigation:**
   Update the URL search parameter using `router.navigate` with `replace: true` and `to: './'`:
   ```tsx
   const onValueChange = useCallback(
     (value: string) => {
       void router.navigate({
         replace: true,
         search: (query) => ({
           ...(query as Record<string, unknown>),
           reportTab: value,
         }),
         to: './',
       })
     },
     [router]
   )
   ```

3. **Thin Route Definition:**
   Declare the route with breadcrumb metadata, search validation, and delegate directly to the feature page:
   ```tsx
   import {
     DashboardPage,
     dashboardRouteSearchSchema,
   } from '@features/dashboard'
   import { createFileRoute } from '@tanstack/react-router'

   export const Route = createFileRoute('/_authenticated/')({
     component: DashboardPage,
     loader: () => ({ crumb: 'dashboard' }),
     validateSearch: dashboardRouteSearchSchema,
   })
   ```

## 4. Grouped Filter Toolbar

For complex reports with dozens of query dimensions, organize filters into categorized dropdown sheets using `GroupedTableFilterQueryParams`:

1. **Ignore Tab Param in Filters:**
   ```ts
   const ignoredQueryParams = ['reportTab'] as const
   ```
2. **Category Groups:**
   Define memoized groups such as `claim`, `assessment`, `policyholder`, `organization`, and `financial`.
3. **Filter Types:**
   - `faceted`: Dropdowns with search (e.g. status, docType).
   - `text`: Search inputs (optionally `numerical: true` for IDs and codes).
   - `dateRange` / `dateTimeRange`: Persian date-picker ranges with `fromPlaceholder` and `toPlaceholder`.
   - `numberRange`: Min/max numeric filters.

## 5. Pivot Table & Data Table Parity

1. **Filter Cleansing Before Queries:**
   Remove UI-only parameters (`reportTab`) before calling reporting endpoints:
   ```ts
   const finalFilters = useMemo(
     () =>
       produce(filters, (draft) => {
         if (draft['reportTab']) delete draft['reportTab']
       }),
     [filters]
   )
   ```

2. **TanStack Query Caching:**
   Use extended stale/gc times for heavy reporting queries:
   ```ts
   staleTime: 10 * 60 * 1000,
   gcTime: 10 * 60 * 1000,
   ```

3. **Pivot Table Configuration:**
   Use `@shared/tables` (`PivotTable`) with typed `PivotData` and readonly `valueFields`:
   ```tsx
   <PivotTable
     data={pivotData}
     rowField='assignedUserDisplayName'
     columnField='statusLabel'
     valueFields={valueFields}
     rowHeaderLabel={t('dashboard.reports.columns.assignedUserDisplayName')}
     isLoading={isLoading || isFetching}
     exportFileName='report-metric-summary'
   />
   ```

4. **Dense Detail Tables:**
   For tabular listings within reports, use `TwoLineHeader` and `TwoLineCell` to pack primary and secondary data (e.g. Contract ID + Policy ID, Title + Location, From Date + Thru Date) without horizontal sprawl.
