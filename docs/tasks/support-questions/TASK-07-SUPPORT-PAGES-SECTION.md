# TASK-07: Support Pages Section

## Objective
Implement the Support Pages section (bottom-left panel), including its local pagination table, columns, row actions, table actions, form dialog, and delete dialog.

## Scope of Work

### 1. `support-pages-section.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-pages/support-pages-section.tsx`
- Encapsulated with `SupportPageProvider`.
- Uses local `useState` for `pagination` (`pageSize: 10`) and `sorting`.
- Calls `supportPageService.getPage`.
- Renders `PaginatedDataTable` with `smallPagination`, `emptyStateText`, and `tableWrapperClassName='max-h-96'`.

### 2. `support-page-columns.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-pages/support-page-columns.tsx`
- Columns:
  - `pageKey`: Header `supportPages.columns.key`, sorting enabled.
  - `title`: Header `supportPages.columns.title`, sorting enabled.
  - `description`: 2-line clamp.
  - `active`: Badge with `supportPages.status.active` / `inactive`.
  - `actions`: `SupportPageRowActions`.

### 3. `support-page-row-actions.tsx` & `support-page-table-actions.tsx`
- Row actions: Edit, Delete buttons.
- Table actions: Refresh, Create Page buttons.

### 4. `support-page-form-dialog.tsx` & `support-page-delete-dialog.tsx`
- Create/Edit form dialog with Zod validation.
- Delete confirmation dialog with prompt including pageKey.

## Verification Criteria
- Table and dialogs function smoothly with local pagination and query invalidation.
