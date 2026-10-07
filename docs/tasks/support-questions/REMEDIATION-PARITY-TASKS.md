# Support Questions: Complete Reference Parity Remediation Tasks

This document details every specific discrepancy identified between the reference implementation (`insurance-ui/src/features/support-questions`) and `iap-admin`, and defines the exact remediation tasks to achieve 100% parity.

---

## Comprehensive Discrepancy Breakdown

### 1. `support-questions-section.tsx`
- **Discrepancy:** Reference calls `supportQuestionService.getPageFull` (hitting `/support/questions/page-full`), while target was calling `getPage`.
- **Discrepancy:** Default sorting direction in query function in reference is: `direction: sort ? (sort.desc ? 'DESC' : 'ASC') : 'desc'`.
- **Discrepancy:** `SupportQuestionTableActions` prop is named `onRefetch={refetch}`.
- **Discrepancy:** Empty state text is `t('supportQuestions.noQuestions')`.
- **Discrepancy:** Data table props include `hasCheckboxes` and `tableWrapperClassName='max-h-130'`.

### 2. `support-question-table-actions.tsx`
- **Discrepancy:** Prop interface is `SupportQuestionTableActionsProps { isLoading: boolean; selectedSupportQuestionIds: string[]; onRefetch: () => void }`.
- **Discrepancy:** Delete button label is `t('supportQuestions.bulkDelete.button')`, variant `destructive`, disabled when `selectedSupportQuestionIds.length === 0`.
- **Discrepancy:** Refresh button calls `onRefetch()`, label is `t('supportQuestions.refresh')`, spinner animation on `isLoading`.
- **Discrepancy:** Create button label is `t('supportQuestions.create')`.
- **Discrepancy:** Buttons have `className='space-x-2'`.

### 3. `support-question-delete-dialog.tsx`
- **Discrepancy:** Title in reference is:
  ```tsx
  <span className='flex items-center gap-2 text-destructive'>
    <IconTrash size={18} />
    {t('supportQuestions.delete.title')}
  </span>
  ```
- **Discrepancy:** Description is `t('common.dialog.deleteDialog.confirmMessage')`.
- **Discrepancy:** Confirm button label is `t('common.delete')`.
- **Discrepancy:** Destructive styling and `presentation='reference'`.

### 4. `support-question-bulk-delete-dialog.tsx`
- **Discrepancy:** Empty selection guard triggers: `toast.error(t('supportQuestions.bulkDelete.noSelection'))`.
- **Discrepancy:** Title in reference is:
  ```tsx
  <span className='flex items-center gap-2 text-destructive'>
    <IconTrash size={18} />
    {t('supportQuestions.bulkDelete.button')}
  </span>
  ```
- **Discrepancy:** Description is `t('common.dialog.deleteDialog.confirmMessage')`.
- **Discrepancy:** Confirm button label is `t('common.delete')`.
- **Discrepancy:** `disableConfirm={supportQuestionIds.length === 0}`.

### 5. `support-question-view-dialog.tsx`
- **Discrepancy:** Title is `t('supportQuestions.dialog.details')`.
- **Discrepancy:** Header renders `supportQuestion?.title` as `h2 text-xl font-bold` and `supportQuestion?.questionKey` as `p break-all text-sm text-muted-foreground`.
- **Discrepancy:** Status badge renders `t('supportQuestions.status.active')` / `t('supportQuestions.status.inactive')`.
- **Discrepancy:** Uses standard 2-column grid layout with `Detail` component displaying:
  - `level`: `supportQuestion?.level?.toString()`
  - `requiredParam`: `supportQuestion?.requiredParam`
  - `requiredParamInputDisplay`: `t('supportQuestions.inputDisplay.' + supportQuestion?.requiredParamInputDisplay)`
  - `sequence`: `supportQuestion?.sequence?.toString()`
  - `nextSelectableQuestionKeys`: comma-separated join

### 6. `support-question-form-dialog.tsx`
- **Discrepancy:** Numeric inputs for `level` and `sequence` use `numerical` prop on `@iap/ui`'s `Input`.
- **Discrepancy:** Reset logic mirrors reference: `if (!open || !isEdit || !currentRow) return` inside `useEffect`, and `close()` calls `reset(defaultValues)`.
- **Discrepancy:** Button labels: cancel is `t('common.cancel')`, submit is `isEdit ? t('common.save') : t('supportQuestions.create')`.

### 7. `support-page-delete-dialog.tsx` & `support-feature-delete-dialog.tsx`
- **Discrepancy:** Dialog titles and descriptions match reference verbatim:
  - Page: title `t('supportPages.delete.title')`, desc `t('supportPages.delete.description', { key: supportPage?.pageKey ?? '' })`, confirm `t('supportPages.actions.delete')`.
  - Feature: title `t('supportFeatures.delete.title')`, desc `t('supportFeatures.delete.description', { key: supportFeature?.featureKey ?? '' })`, confirm `t('supportFeatures.actions.delete')`.
- **Discrepancy:** Cancel button label in dialog is `t('common.dialog.cancel')`.

### 8. `support-page-form-dialog.tsx` & `support-feature-form-dialog.tsx`
- **Discrepancy:** Cancel button label is `t('common.dialog.cancel')` (translated to "لغو").
- **Discrepancy:** Action button labels: `t('supportPages.actions.save')` / `t('supportPages.actions.create')`, `t('supportFeatures.actions.save')` / `t('supportFeatures.actions.create')`.

### 9. Context & Hook Flexibility
- **Discrepancy:** `useSupportQuestion`, `useSupportPage`, and `useSupportFeature` must support both `useSupportQuestion((state) => state.open)` and destructuring `const { setOpen, setCurrentRow } = useSupportQuestion()`.

---

## Action Plan & Execution Batches

- **Batch 1 (Store & Context Polish):** Ensure `useSupportQuestion`, `useSupportPage`, `useSupportFeature` support selector-less and selector-based consumption.
- **Batch 2 (Questions Section & Actions Parity):** Update `support-questions-section.tsx`, `support-question-table-actions.tsx`, `support-question-delete-dialog.tsx`, `support-question-bulk-delete-dialog.tsx`, `support-question-view-dialog.tsx`.
- **Batch 3 (Form Dialogs Parity):** Update `support-question-form-dialog.tsx` with `numerical` prop, `support-page-form-dialog.tsx`, `support-feature-form-dialog.tsx` with `common.dialog.cancel`.
- **Batch 4 (Pages & Features Delete Dialogs Parity):** Update `support-page-delete-dialog.tsx` and `support-feature-delete-dialog.tsx`.
- **Batch 5 (Verification & Quality Gates):** Run typecheck, unit tests, lint, build, and `git diff --check`.
