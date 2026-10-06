# Assignment Rules Parity Implementation Details

## TASK-PARITY-01: Context & State Management
- **File:** `apps/iap-admin/src/features/assignement-rules/context/assignement-rule-context.tsx`
- **Actions:**
  - Define `AssignementRuleDialogType = 'create' | 'edit' | 'delete' | 'bulkDelete'`.
  - State fields: `open`, `currentRow`, `rowSelection`.
  - Actions: `setOpen`, `setCurrentRow`, `setRowSelection`, `reset`.
  - Export `useAssignementRuleStore`, `AssignementRuleProvider`, and `useAssignementRule = useAssignementRuleStore`.
  - Provide backward-compatible shim in `context/store/assignement-rule-store.ts`.

## TASK-PARITY-02: Schemas & Data Hook
- **Files:**
  - `apps/iap-admin/src/features/assignement-rules/data/assignement-rule-schema.ts`
  - `apps/iap-admin/src/features/assignement-rules/hooks/use-assignement-rules-data.ts`
- **Actions:**
  - In `data/assignement-rule-schema.ts`, export contracts and `assignementRuleFormSchema(t: TFunction)` matching reference.
  - In `hooks/use-assignement-rules-data.ts`, implement `useAssignementRulesData({ pagination, filters })` with query key `['assignement-rules', pagination, filters]`, `staleTime: 30_000`, `gcTime: 30_000`, `refetchOnWindowFocus: false`.

## TASK-PARITY-03: Service Alignment
- **File:** `apps/iap-admin/src/features/assignement-rules/services/assignement-rule-service.ts`
- **Actions:**
  - Set default `size = 30` in `getPage`.
  - Implement `toPayload(data)` mapping `fromDate` and `thruDate` via `.toISOString()`.
  - Export both `export default assignementRuleService` and `export { assignementRuleService }`.

## TASK-PARITY-04: Row Actions
- **File:** `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-row-actions.tsx`
- **Actions:**
  - Use `IconEdit` and `IconTrash` from `@tabler/icons-react`.
  - Consume `useAssignementRule` with `setCurrentRow` and `setOpen('edit')`, `setOpen('delete')`.

## TASK-PARITY-05: Form Dialog & Supporting Fields
- **Files:**
  - `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-form-dialog.tsx`
  - `apps/iap-admin/src/features/assignement-rules/components/agreement-policy-id-field.tsx`
- **Actions:**
  - In `assignement-rule-form-dialog.tsx`:
    - Consume `useAssignementRule` (`open === 'create' || open === 'edit'`, `setOpen(null)`).
    - Use `SingleSelect` from `@iap/ui` for `status` with exact reference items.
    - Set `presentation='reference'` on `DatePicker`.
  - In `agreement-policy-id-field.tsx`:
    - Use `SearchableSelect` from `@iap/ui` with `items={options}`, `selected={selected}`, `onSearch={setSearchTerm}`, `isLoading={isFetching}`.

## TASK-PARITY-06: Delete Dialogs
- **Files:**
  - `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-delete-dialog.tsx`
  - `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-bulk-delete-dialog.tsx`
- **Actions:**
  - Consume `useAssignementRule` (`open === 'delete'`, `open === 'bulkDelete'`).
  - In `bulk-delete-dialog.tsx`, use `IconTrash` from `@tabler/icons-react` in dialog title.

## TASK-PARITY-07: Page Composition
- **File:** `apps/iap-admin/src/features/assignement-rules/pages/assignement-rules-page.tsx` (and `assignement-rules-page.tsx`)
- **Actions:**
  - Wrap content with `<AssignementRuleProvider>` as default export.
  - Wrap table and controls with `<Main>` from `@shared/components/layout/main`.
  - Use Tabler icons: `IconTrash`, `IconRefresh`, `IconPlus`.
  - Consume `useAssignementRule` and `useAssignementRulesData`.

## TASK-PARITY-08: Verification & Quality Gates
- **Actions:**
  - Run all Vitest test suites.
  - Run `pnpm typecheck`.
  - Run `pnpm lint`.
  - Run `pnpm architecture:check`.
  - Run `pnpm build`.
  - Run `git diff --check`.
