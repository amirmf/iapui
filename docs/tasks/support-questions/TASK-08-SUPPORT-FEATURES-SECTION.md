# TASK-08: Support Features Section

## Objective
Implement the Support Features section (bottom-right panel), including its local pagination table, columns, row actions, table actions, form dialog, and delete dialog.

## Scope of Work

### 1. `support-features-section.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-features/support-features-section.tsx`
- Encapsulated with `SupportFeatureProvider`.
- Uses local `useState` for `pagination` (`pageSize: 10`) and `sorting`.
- Calls `supportFeatureService.getPage`.
- Renders `PaginatedDataTable` with `smallPagination`, `emptyStateText`, and `tableWrapperClassName='max-h-96'`.

### 2. `support-feature-columns.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-features/support-feature-columns.tsx`
- Columns:
  - `featureKey`: Header `supportFeatures.columns.key`, sorting enabled.
  - `title`: Header `supportFeatures.columns.title`, sorting enabled.
  - `description`: 2-line clamp.
  - `pageKeys`: Comma-joined list or `-`.
  - `active`: Badge with `supportFeatures.status.active` / `inactive`.
  - `actions`: `SupportFeatureRowActions`.

### 3. `support-feature-row-actions.tsx` & `support-feature-table-actions.tsx`
- Row actions: Edit, Delete buttons.
- Table actions: Refresh, Create Feature buttons.

### 4. `support-feature-form-dialog.tsx` & `support-feature-delete-dialog.tsx`
- Form dialog with `pageKeys` multi-select populated by `supportPageService.getPage`.
- Delete confirmation dialog with prompt including featureKey.

## Verification Criteria
- Table and dialogs function smoothly with local pagination and query invalidation.
