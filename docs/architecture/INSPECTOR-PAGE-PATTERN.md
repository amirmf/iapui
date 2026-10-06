# Inspector Page Pattern (Master-Detail Architecture)

This document describes the architectural pattern for complex administration pages containing a primary data table alongside an inspector panel with sub-tables (Master-Detail workflow), as established in `features/ai-assessment-rules`.

## Goals
- **Single Responsibility (SRP)**: Keep page components small (under 60 lines), focused purely on visual composition.
- **High Rendering Performance**: Prevent unnecessary re-renders across the table and inspector.
- **Strict State Separation**: Zero server-state leakage into Zustand; full memory cleanup on navigation.
- **Predictable Query Boundaries**: No inline queries or direct service calls inside UI components.

---

## 1. Page Component & Custom State Hook

The page component delegates all data-fetching, URL parameters, pagination, sorting, and row-selection logic to a dedicated custom hook: `use<Feature>PageState`.

```tsx
// features/<feature>/pages/index.tsx OR features/<feature>/<feature>-page.tsx
export function FeatureContent() {
  const { t } = useTranslate()
  const columns = useFeatureColumns()
  const {
    inspectedItem,
    onPaginationChange,
    onSortingChange,
    pagination,
    query,
    rowSelection,
    items,
    selectedIds,
    setRowSelection,
    sorting,
  } = useFeaturePageState()

  return (
    <>
      <Main>
        <FeatureHeaderActions />
        <FeatureToolbar />
        <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)] xl:grid-cols-[minmax(0,1fr)_minmax(22rem,35rem)]'>
          <PaginatedDataTable
            columns={columns}
            data={items}
            pagination={pagination}
            rowSelection={rowSelection}
            onPaginationChange={onPaginationChange}
            onRowSelectionChange={setRowSelection}
            onSortingChange={onSortingChange}
            ...
          />
          <FeatureInspector item={inspectedItem} />
        </div>
      </Main>
      <FeatureDialogs />
    </>
  )
}
```

### Custom Hook Responsibility:
- Reads and validates search params from TanStack Router.
- Executes `useTableFilterQueryParams`.
- Invokes primary list query with proper cache key.
- Resolves `inspectedItem` safely by row ID or validated row index.
- Automatically resets row selection on pagination changes.

---

## 2. Multi-Store Provider Lifecycle & Memory Cleanup

When a feature employs multiple client stores (e.g., Main table selection, Details sub-table, Levels sub-table):

- The feature-level `Provider` must reset **all** stores upon unmount.
- Do not rely solely on sub-components' unmount effects, as sub-components may remain unmounted when navigating away from the page.

```tsx
// features/<feature>/context/provider/<feature>-provider.tsx
export default function FeatureProvider({ children }: { children: ReactNode }) {
  const resetMain = useFeatureStore((s) => s.reset)
  const resetDetails = useFeatureDetailsTableStore((s) => s.reset)
  const resetSubTable = useFeatureSubTableStore((s) => s.reset)

  useEffect(() => () => {
    resetMain()
    resetDetails()
    resetSubTable()
  }, [resetMain, resetDetails, resetSubTable])

  return <>{children}</>
}
```

---

## 3. Query Boundaries for Complex Form Fields

When form fields dynamically fetch remote reference options (e.g., agreements, document types, users):

- **Rule 1**: UI form components must never import `service` directly.
- **Rule 2**: Queries and query key factories must reside in `queries/`.
- **Rule 3**: Form fields only consume dedicated query hooks (e.g., `useAgreementOptionsQuery`).

```text
features/<feature>/
├── queries/
│   ├── use-<feature>.ts            # Main entity queries & mutations
│   └── use-agreement-options.ts    # Dedicated options query & keys
```

---

## 4. Form Resolver Consistency

Use `typedZodResolver` across all forms (main form and inspector sub-forms) for strict type inference and uniform error handling:

```tsx
const form = useForm<FormValues>({
  defaultValues: toFormValues(initialItem),
  resolver: typedZodResolver(formSchema(t)),
})
```

---

## 5. Intra-feature vs Cross-feature Imports

- **Intra-feature**: Always use relative imports (`../constants/...`, `../../queries/...`). Never use `@features/<own-feature>/...`.
- **Cross-feature**: Import only through public exports (`@features/<other-feature>`).
