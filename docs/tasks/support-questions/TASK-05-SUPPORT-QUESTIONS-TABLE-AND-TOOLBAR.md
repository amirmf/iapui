# TASK-05: Support Questions Table, Columns, and Toolbar

## Objective
Implement table columns, data table toolbar with search and faceted filters, and table actions for the top Support Questions section.

## Scope of Work

### 1. `support-question-columns.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/support-question-columns.tsx`
- Columns:
  1. `title`: TwoLineHeader & TwoLineCell with `primary={row.original.title}`, `secondary={row.original.questionKey}`, `longText`.
  2. `level`: TwoLineHeader & TwoLineCell with `primary={row.original.level}`, `secondary={nextSelectableQuestionKeys.join(', ')}`, `longTextSecondary`, `enableSorting: false`.
  3. `requiredParam`: TwoLineHeader & TwoLineCell with `primary={row.original.requiredParam}`, `secondary={t(inputDisplay)}`, `longTextPrimary`.
  4. `active`: TwoLineHeader & TwoLineCellWrapper with Status Badge (`active`/`inactive`), and sequence.
  5. `roles`: TwoLineHeader with wrapped PartyRole Badges.
  6. `actions`: Sticky left cell rendering `SupportQuestionRowActions`.

### 2. `support-questions-data-table-toolbar.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/support-questions-data-table-toolbar.tsx`
- Uses `TableFilterQueryParams` from `@shared/tables/filter`.
- Text filters: `questionKey` (asLike: true), `title` (asLike: true).
- Faceted filter: `requiredParamInputDisplay` with `getSupportRequiredParamInputDisplayOptions(t)`.

### 3. `support-question-table-actions.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/support-question-table-actions.tsx`
- Action buttons:
  - Bulk Delete: destructive variant, disabled when `selectedSupportQuestionIds.length === 0`, opens `bulkDelete` dialog.
  - Refresh: outline variant, icon spins when loading, triggers `onRefetch`.
  - Create: primary button with `IconPlus`, opens `create` dialog.

## Verification Criteria
- Correct column header/cell rendering, proper sorting flags, and toolbar filter bindings.
