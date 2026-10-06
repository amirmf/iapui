# TASK-09: Single and Bulk Delete Dialogs

## Objective
Implement `AssignementRuleDeleteDialog` and `AssignementRuleBulkDeleteDialog` using `@iap/dialogs`'s `ConfirmDialog`, handling single deletion and multi-item deletion with proper confirmation warnings and mutation flows.

## Reference Source
- `insurance-ui/src/features/assignement-rules/components/assignement-rule-delete-dialog.tsx`
- `insurance-ui/src/features/assignement-rules/components/assignement-rule-bulk-delete-dialog.tsx`

## Implementation Target
- `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-delete-dialog.tsx`
- `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-bulk-delete-dialog.tsx`
- Tests: `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-delete-dialog.test.tsx`

## 1. Single Delete Dialog (`assignement-rule-delete-dialog.tsx`)
```ts
export function AssignementRuleDeleteDialog(props: {
  refetch: () => Promise<unknown> | void
})
```
- Open condition: `openDialog === 'delete'`.
- Component: `ConfirmDialog` from `@iap/dialogs`.
- Title: `t('assignementRules.dialog.delete')`.
- Description: `t('assignementRules.dialog.deleteDescription')`.
- Confirm label: `t('common.delete')`.
- Confirm variant / destructive: `variant='error'` or `confirmVariant='destructive'`.
- Mutation calls `assignementRuleService.delete(currentRow.id)`.
- Success: toasts `t('assignementRules.messages.deleted')`, refetches, closes dialog, clears current row.
- Error: toasts `t('assignementRules.messages.deleteFailed')`.

## 2. Bulk Delete Dialog (`assignement-rule-bulk-delete-dialog.tsx`)
```ts
export function AssignementRuleBulkDeleteDialog(props: {
  ids: string[]
  refetch: () => Promise<unknown> | void
})
```
- Open condition: `openDialog === 'bulkDelete'`.
- Component: `ConfirmDialog` from `@iap/dialogs`.
- Title: contains trash icon + `t('assignementRules.bulkDelete.title')`.
- Description: `t('assignementRules.bulkDelete.description', { count: ids.length })`.
- Confirm label: `t('common.delete')`.
- Disabled when `ids.length === 0`.
- Mutation calls `assignementRuleService.bulkDelete(ids)`.
- Success: toasts `t('assignementRules.messages.bulkDeleted')`, clears row selection, refetches, closes dialog.
- Error: toasts `t('assignementRules.messages.bulkDeleteFailed')`.

## 3. Unit Tests
- Verify single delete dialog renders with row title/context and triggers delete on confirmation.
- Verify bulk delete dialog renders count, triggers bulkDelete on confirmation, and resets row selection.
- Verify dialog close and cancel handlers.

## Acceptance Criteria
- [ ] Uses `@iap/dialogs` `ConfirmDialog` primitive.
- [ ] All Persian strings match reference project.
- [ ] Row selection is cleared on bulk delete completion.
- [ ] Component tests pass.
