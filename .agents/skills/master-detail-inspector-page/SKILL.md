---
name: master-detail-inspector-page
description: Guide and best practices for building high-performance, clean Master-Detail admin pages with side inspector panels and sub-tables.
---

# Master-Detail Inspector Page Pattern

Use this skill when implementing or refactoring complex operations pages that feature a primary paginated data table alongside a collapsible/side inspector panel with sub-tables (e.g., `ai-assessment-rules`, `assignement-rules`, `doc-types`).

## 1. Single Responsibility (SRP) & Page Component Sizing

- **Page Component**: Must remain small (under 65 lines) and focus purely on layout and composition (`Main`, header actions, toolbar, grid with table & inspector, dialogs).
- **Custom Hook Delegation**: Delegate all URL search synchronization, TanStack Query calls, pagination, sorting, and row selection state into a dedicated `use<Feature>PageState()` hook located in `features/<feature>/hooks/`.

```tsx
// features/<feature>/<feature>-page.tsx
export function FeatureContent() {
  const { t } = useTranslate()
  const columns = useFeatureColumns()
  const {
    inspectedRule,
    onPaginationChange,
    onSortingChange,
    pagination,
    query,
    rowSelection,
    rules,
    selectedIds,
    setRowSelection,
    sorting,
  } = useFeaturePageState()

  return (
    <>
      <Main>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          {/* Header title & actions */}
          <FeatureTableActions
            hasSelection={selectedIds.length > 0}
            isRefreshing={query.isFetching}
            onRefresh={() => query.refetch()}
          />
        </div>
        <div className='-mx-4 flex-1 px-4 py-1'>
          <FeatureDataTableToolbar />
          <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)] xl:grid-cols-[minmax(0,1fr)_minmax(22rem,35rem)]'>
            <div className='min-w-0 overflow-auto'>
              <PaginatedDataTable
                columns={columns}
                data={rules}
                pagination={pagination}
                rowSelection={rowSelection}
                onPaginationChange={onPaginationChange}
                onRowSelectionChange={setRowSelection}
                onSortingChange={onSortingChange}
                ...
              />
            </div>
            <FeatureInspector onRefresh={query.refetch} rule={inspectedRule} />
          </div>
        </div>
      </Main>
      <FeatureDialogs />
    </>
  )
}
```

## 2. Multi-Store Provider Lifecycle & Memory Cleanup

Features with side inspector panels typically maintain multiple client Zustand stores:
1. Main selection & dialogs store (`context/store/<feature>-store.ts`)
2. Details sub-table store (`context/store/<feature>-details-table-store.ts`)
3. Sub-items / secondary table store (`context/store/<feature>-sub-table-store.ts`)

**Rule**: The feature's root `Provider` must reset **all** feature-scoped stores upon unmount. Do not rely solely on sub-components' unmount effects because unselected inspector sections may not be mounted when navigating away.

```tsx
// features/<feature>/context/provider/<feature>-provider.tsx
export default function FeatureProvider({ children }: { children: ReactNode }) {
  const resetMain = useFeatureStore((s) => s.reset)
  const resetDetails = useFeatureDetailsStore((s) => s.reset)
  const resetSubTable = useFeatureSubTableStore((s) => s.reset)

  useEffect(() => () => {
    resetMain()
    resetDetails()
    resetSubTable()
  }, [resetMain, resetDetails, resetSubTable])

  return <>{children}</>
}
```

## 3. Query Boundaries for Reference Selectors

When form fields inside dialogs dynamically search external entities (such as Agreements, Document Types, or Coverages):
- **Never** call backend services directly inside React UI components.
- **Never** hardcode string array query keys (e.g. `['agreement-options', ...]`) inline inside components.
- Extract dedicated query hooks and key factories to `features/<feature>/queries/use-<entity>-options.ts`.

## 4. Form Validation Consistency

- Always use `typedZodResolver(schema(t))` across all forms (main form and inspector sub-forms) for strict type safety and consistent error mapping.
- Keep form schemas translated with the injected `t` function.

## 5. Import Hygiene

- **Intra-feature**: Always use relative paths (`../constants/...`, `../../queries/...`). Never import own feature using `@features/<own-feature>/...`.
- **Cross-feature**: Always import through the public barrel export (`@features/<other-feature>`).
