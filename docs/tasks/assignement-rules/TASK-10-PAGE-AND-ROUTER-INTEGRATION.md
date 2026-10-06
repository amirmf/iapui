# TASK-10: Page Composition and Router Integration

## Objective
Assemble the `/assignement-rules/` page component (`AssignementRulesPage`), create the feature barrel export, and replace the placeholder in `apps/iap-admin/src/app/router/routes/_authenticated/assignement-rules/index.tsx`.

## Reference Source
- `insurance-ui/src/routes/_authenticated/assignement-rules/index.tsx`
- `insurance-ui/src/features/assignement-rules/pages/assignement-rules-page.tsx`

## Implementation Target
- Feature page: `apps/iap-admin/src/features/assignement-rules/assignement-rules-page.tsx`
- Feature barrel: `apps/iap-admin/src/features/assignement-rules/index.ts`
- Route entry: `apps/iap-admin/src/app/router/routes/_authenticated/assignement-rules/index.tsx`
- Page tests: `apps/iap-admin/src/features/assignement-rules/assignement-rules-page.test.tsx`

## 1. Page Component (`assignement-rules-page.tsx`)
Following the single-root-route pattern established by `person-special-diseases-page.tsx` and `agreements-page.tsx`:

- **Header:**
  - Title: `t('assignementRules.title')`
  - Action buttons:
    - **Bulk Delete:**
      - Variant: `'destructive'`
      - Icon: `<Trash2 className='size-4' />`
      - Text: `t('assignementRules.bulkDelete.button')`
      - Disabled when `selectedRuleIds.length === 0`
      - Click: `setOpenDialog('bulkDelete')`
    - **Refresh:**
      - Variant: `'outline'`
      - Icon: `<RefreshCw className={cn('size-4', isLoading && 'animate-spin')} />`
      - Text: `t('assignementRules.actions.refresh')`
      - Disabled when `isLoading`
      - Click: `refetch()`
    - **Create:**
      - Variant: `'default'`
      - Icon: `<Plus className='size-4' />`
      - Text: `t('assignementRules.actions.create')`
      - Click: `setCurrentRow(null); setOpenDialog('create')`

- **Toolbar:**
  - `<AssignementRuleDataTableToolbar />`

- **Table:**
  - Uses `PaginatedDataTable` from `@shared/tables`
  - Columns from `useAssignementRuleColumns()`
  - Data from query hook
  - `hasCheckboxes={true}`
  - `pageCount={data?.totalPages ?? 0}`
  - `totalCount={data?.totalElements ?? 0}`
  - `emptyStateText={t('assignementRules.empty')}`
  - Controlled pagination from table state adapter

- **Dialogs:**
  - `<AssignementRuleFormDialog refetch={refetch} />`
  - `<AssignementRuleDeleteDialog refetch={refetch} />`
  - `<AssignementRuleBulkDeleteDialog ids={selectedRuleIds} refetch={refetch} />`

- **Store cleanup:**
  - Cleans up / resets `assignementRuleStore` on unmount.
  - Clears `rowSelection` on pagination changes.

## 2. Feature Barrel Export (`index.ts`)
```ts
export { AssignementRulesPage } from './assignement-rules-page'
export { assignementRuleRouteSearchSchema } from './route-adapters/route-search-schema'
```

## 3. Route File (`apps/iap-admin/src/app/router/routes/_authenticated/assignement-rules/index.tsx`)
Replace existing placeholder with:
```tsx
import {
  AssignementRulesPage,
  assignementRuleRouteSearchSchema,
} from '@features/assignement-rules'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/assignement-rules/'
)({
  component: AssignementRulesPage,
  loader: () => ({ crumb: 'assignementRules' }),
  validateSearch: assignementRuleRouteSearchSchema,
})
```

## Acceptance Criteria
- [ ] Route is thin, containing only route declaration, loader crumb, search validation, and page delegation.
- [ ] Feature public API is used for router imports.
- [ ] Header actions, toolbar, table, and dialogs are fully coordinated.
- [ ] Page renders without errors.
