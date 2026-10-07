# TASK-06: Support Questions Row Actions and Dialogs

## Objective
Implement row actions, create/edit form dialog, view details dialog, single delete dialog, bulk delete dialog, and next selectable question keys multi-select field.

## Scope of Work

### 1. `support-question-row-actions.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/support-question-row-actions.tsx`
- Actions:
  - View: `IconEye`, sets current row and opens `view` dialog.
  - Edit: `IconEdit`, sets current row and opens `edit` dialog.
  - Delete: `IconTrash` (destructive), sets current row and opens `delete` dialog.

### 2. `support-question-form-dialog.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/support-question-form-dialog.tsx`
- Form fields:
  - `questionKey`: Text Input (required)
  - `title`: Text Input (required)
  - `level`: Numerical Input
  - `requiredParam`: Text Input
  - `requiredParamInputDisplay`: SearchableSelect with input display options
  - `sequence`: Numerical Input
  - `nextSelectableQuestionKeys`: Handled by `SupportQuestionNextSelectableQuestionKeysField`
  - `roles`: MultiSelect with `getPartyRoleOptions(t)`
  - `pageTags`: MultiSelect populated by `supportPageService.getPage`
  - `featureTags`: MultiSelect populated by `supportFeatureService.getPage`
  - `staticResponse`: Multiline response editor
  - `active`: Checkbox
- Form handler: Create / Update mutations with TanStack Query and Sonner toast.

### 3. `support-question-next-selectable-question-keys-field.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/support-question-next-selectable-question-keys-field.tsx`
- Uses `useWatch` to exclude current `questionKey`.
- Debounced search querying `supportQuestionService.getPageFull` by `title__like`.
- MultiSelect allowing item selection.

### 4. `support-question-view-dialog.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/support-question-view-dialog.tsx`
- Read-only details view of question attributes.

### 5. `support-question-delete-dialog.tsx` & `support-question-bulk-delete-dialog.tsx`
- Location: `apps/iap-admin/src/features/support-questions/components/support-questions/`
- ConfirmDialog with destructive action, loading state, and query refetch.

## Verification Criteria
- Dialog open/close transitions, validation feedback, and mutation handling work properly.
