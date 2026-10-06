# Assignment Rules Parity Remediation Plan

This directory documents the granular, component-by-component discrepancies identified by comparing the implementation in `iap-admin` with the reference implementation in `insurance-ui`, along with the exact step-by-step parity alignment tasks.

## Reference Source of Truth
- **Route:** `insurance-ui/src/routes/_authenticated/assignement-rules/index.tsx`
- **Page:** `insurance-ui/src/features/assignement-rules/pages/assignement-rules-page.tsx`
- **Context:** `insurance-ui/src/features/assignement-rules/context/assignement-rule-context.tsx`
- **Hook:** `insurance-ui/src/features/assignement-rules/hooks/use-assignement-rules-data.ts`
- **Service:** `insurance-ui/src/features/assignement-rules/services/assignement-rule-service.ts`
- **Data Schemas:** `insurance-ui/src/features/assignement-rules/data/assignement-rule-schema.ts`
- **Columns:** `insurance-ui/src/features/assignement-rules/components/assignement-rule-columns.tsx`
- **Row Actions:** `insurance-ui/src/features/assignement-rules/components/assignement-rule-row-actions.tsx`
- **Toolbar:** `insurance-ui/src/features/assignement-rules/components/assignement-rule-data-table-toolbar.tsx`
- **Form Dialog:** `insurance-ui/src/features/assignement-rules/components/assignement-rule-form-dialog.tsx`
- **Delete Dialog:** `insurance-ui/src/features/assignement-rules/components/assignement-rule-delete-dialog.tsx`
- **Bulk Delete Dialog:** `insurance-ui/src/features/assignement-rules/components/assignement-rule-bulk-delete-dialog.tsx`
- **Doc Type Field:** `insurance-ui/src/features/assignement-rules/components/assignement-rule-doc-type-code-field.tsx`
- **Agreement Policy Field:** `insurance-ui/src/components/agreement/agreement-policy-id-field.tsx`

---

## Identified Discrepancies Summary

| # | Component / Layer | Discrepancies vs Reference | Action Required |
|---|---|---|---|
| 1 | **Context & State** | Target used `context/store/assignement-rule-store.ts` with `openDialog`/`setOpenDialog`. Reference uses `context/assignement-rule-context.tsx`, exporting `AssignementRuleProvider`, `useAssignementRule` and `open`/`setOpen`. | Align context file name, export `AssignementRuleProvider`, alias `useAssignementRule`, and use `open`/`setOpen`. |
| 2 | **Schemas & Data Hook** | Reference has `data/assignement-rule-schema.ts` and `hooks/use-assignement-rules-data.ts` with `useAssignementRulesData` and queryKey `['assignement-rules', pagination, filters]`. | Provide `data/assignement-rule-schema.ts` and `hooks/use-assignement-rules-data.ts`. |
| 3 | **Service** | Reference has default `size: 30`, converts dates to ISO string in `toPayload`, and exports default `assignementRuleService`. | Align default parameters, ISO date mapping, and exports in `services/assignement-rule-service.ts`. |
| 4 | **Row Actions** | Reference uses `IconEdit` and `IconTrash` from `@tabler/icons-react` and `useAssignementRule`. | Update icons to Tabler icons and update store hook calls. |
| 5 | **Form Dialog & Fields** | Reference uses `SingleSelect` for status, `SearchableSelect` for policy id, `DatePicker` with `clearable`, and `useAssignementRule`. | Align `assignement-rule-form-dialog.tsx` and `agreement-policy-id-field.tsx`. |
| 6 | **Delete Dialogs** | Reference uses `IconTrash` from `@tabler/icons-react` in bulk delete title, and `useAssignementRule`. | Update icons and store hook in delete dialogs. |
| 7 | **Page Composition** | Reference wraps in `<AssignementRuleProvider>`, uses `<Main>`, and uses Tabler icons (`IconTrash`, `IconRefresh`, `IconPlus`). | Update `pages/assignement-rules-page.tsx` to match structure 100%. |
| 8 | **Quality & Tests** | Unit tests and workspace verification gates. | Update unit tests and run all repository checks. |

---

## Tasks Execution Matrix

- [x] **TASK-PARITY-01**: Context & State Management (`assignement-rule-context.tsx`)
- [x] **TASK-PARITY-02**: Schemas & Data Hook (`data/assignement-rule-schema.ts`, `hooks/use-assignement-rules-data.ts`)
- [x] **TASK-PARITY-03**: Service Parity (`services/assignement-rule-service.ts`)
- [x] **TASK-PARITY-04**: Row Actions Parity (`components/assignement-rule-row-actions.tsx`)
- [x] **TASK-PARITY-05**: Form Dialog & Fields Parity (`components/assignement-rule-form-dialog.tsx`, `agreement-policy-id-field.tsx`)
- [x] **TASK-PARITY-06**: Delete Dialogs Parity (`components/assignement-rule-delete-dialog.tsx`, `components/assignement-rule-bulk-delete-dialog.tsx`)
- [x] **TASK-PARITY-07**: Page Composition Parity (`pages/assignement-rules-page.tsx`)
- [x] **TASK-PARITY-08**: Comprehensive Testing & Verification Gates
