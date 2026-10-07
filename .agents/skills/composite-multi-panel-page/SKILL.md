---
name: composite-multi-panel-page
description: Guide and best practices for building composite multi-panel operations pages with a primary top data table and secondary bottom sub-tables.
---

# Composite Multi-Panel Page Pattern

Use this skill when implementing or refactoring complex operations pages that compose multiple related entities into a single screen (e.g. `support-questions` with Questions on top and Pages/Features below).

## 1. Architectural Layout & Composition

A composite multi-panel page divides the UI into:
1. **Primary Top Panel (Full-Width):**
   - The primary resource (e.g. `SupportQuestionsSection`).
   - Synchronized with URL query parameters via `useTableFilterQueryParams`.
   - Full toolbar with search, faceted dropdown filters, bulk delete, refresh, and create action buttons.
   - TanStack Table with row checkboxes, sorting, and pagination.
2. **Secondary Bottom Grid (Two-Column):**
   - Related lookup or configuration entities (e.g. `SupportPagesSection` and `SupportFeaturesSection`).
   - Arranged side-by-side using `<div className='grid gap-6 lg:grid-cols-2'>`.
   - Uses local `useState` pagination and sorting without polluting URL search params.
   - Independent table actions (Refresh, Create) and row actions (Edit, Delete).

```tsx
// features/<feature>/<feature>-page.tsx
export function FeaturePage() {
  return (
    <FeatureProvider>
      <div className='space-y-6 pb-5'>
        <PrimarySection />
        <div className='grid gap-6 lg:grid-cols-2'>
          <SubSectionA />
          <SubSectionB />
        </div>
      </div>
    </FeatureProvider>
  )
}
```

## 2. State Isolation & Unmount Cleanup

Each section MUST manage its own dialogs and active row state to prevent cross-talk:
- Define lightweight Zustand stores (`useQuestionStore`, `usePageStore`, `useFeatureStore`).
- Provide unmount cleanup via React Provider wrappers:
  ```tsx
  export function FeatureProvider({ children }: { children: ReactNode }) {
    const reset = useFeatureStore((state) => state.reset)
    useEffect(() => () => reset(), [reset])
    return <>{children}</>
  }
  ```
- Store hooks should support both selector syntax (`useFeatureStore((s) => s.open)`) and direct hook invocation (`const { setOpen, setCurrentRow } = useFeature()`).

## 3. Query Key and Invalidation Hygiene

- Primary section query key: `['<primary-entity>', pagination, filters, sort]`.
- Secondary section query key: `['<secondary-entity>', pagination, sort]`.
- Mutations inside a section must invalidate:
  1. Their local query key (e.g. `queryClient.invalidateQueries({ queryKey: ['<secondary-entity>'] })`).
  2. The parent or sibling lookup options when relevant (e.g. creating a page invalidates options in question form dialogs).

## 4. Dialog and Form Parity

- **Delete Dialogs:** Use `@iap/dialogs` `ConfirmDialog` with `presentation='reference'` and `destructive`.
- **Form Dialogs:**
  - Separate create and edit modes cleanly (`isEdit = Boolean(currentRow?.id)`).
  - Use `typedZodResolver(schema(t))` for client-side validation.
  - Reset form on `open` change and clean up on `close()`.
  - For numeric fields (such as `sequence` or `level`), use the `numerical` prop on `@iap/ui`'s `Input` primitive.
