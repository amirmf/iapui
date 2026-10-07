# Pipelines Page Parity Audit & Discrepancies Matrix

This document provides a line-by-line parity audit between the reference implementation in `insurance-ui` and the target implementation in `iap-admin`, identifying all discrepancies across file structure, components, props, hooks, and presentation styling.

## 1. Reference Sources
- Route: `insurance-ui/src/routes/_authenticated/pipelines/index.tsx`
- Page: `insurance-ui/src/features/pipelines/pages/pipelines-page.tsx`
- Jobs Table: `insurance-ui/src/features/pipelines/components/pipeline-jobs-table.tsx`
- Executions Table: `insurance-ui/src/features/pipelines/components/pipeline-executions-table.tsx`
- Schemas: `insurance-ui/src/features/pipelines/data/pipeline-schema.ts`
- Service: `insurance-ui/src/features/pipelines/services/pipeline-service.ts`
- Hooks: `insurance-ui/src/features/pipelines/hooks/use-pipelines.ts`
- Table Action Button: `insurance-ui/src/components/data-table/table-action-button.tsx`
- Confirm Dialog: `insurance-ui/src/components/dialogs/confirm-dialog.tsx`

---

## 2. Discrepancy Inventory

| ID | Component / Area | Reference (`insurance-ui`) | Current Target (`iap-admin`) | Parity Resolution | Status |
| --- | --- | --- | --- | --- | --- |
| **DISC-01** | Page Directory Structure | `features/pipelines/pages/pipelines-page.tsx` (`export default function PipelinesPage`) | `features/pipelines/pipelines-page.tsx` (in feature root) | Place canonical page at `features/pipelines/pages/pipelines-page.tsx` with default & named export; re-export at feature root. | Resolved & Verified |
| **DISC-02** | Schema Location & Imports | `features/pipelines/data/pipeline-schema.ts` imported directly by service & tables | Only in `packages/api-types/src/pipeline/index.ts` | Provide `features/pipelines/data/pipeline-schema.ts` re-exporting all schemas & types from `@iap/api-types`. | Resolved & Verified |
| **DISC-03** | Hook Location & Export | `features/pipelines/hooks/use-pipelines.ts` | `features/pipelines/queries/use-pipelines.ts` | Provide `features/pipelines/hooks/use-pipelines.ts` matching exact path & exports. | Resolved & Verified |
| **DISC-04** | MutationFn Handlers in Page | `mutationFn: pipelineService.start`, `stop`, `restart` direct function references | Wrapped in arrow functions `(req) => pipelineService.start(req)` | Use direct function references matching reference. | Resolved & Verified |
| **DISC-05** | ConfirmDialog Interface | `<ConfirmDialog open={...} onOpenChange={...} title={...} desc={...} confirmText={...} destructive isLoading={...} handleConfirm={...} />` | `<ConfirmDialog presentation='reference' confirmLabel={...} confirmVariant='destructive' description={...} onConfirm={...} ... />` | Provide `components/confirm-dialog.tsx` adapter matching exact reference props (`desc`, `confirmText`, `destructive`, `handleConfirm`). | Resolved & Verified |
| **DISC-06** | TableActionButton `variant='info'` | Supports `variant='info'` with `text-blue-700 hover:bg-blue-100 hover:text-blue-700` used by restart button | Replaced with `presentation='reference'` without blue variant | Support `info`, `success`, `primary` variants in `TableActionButton` so restart button has exact blue reference appearance. | Resolved & Verified |
| **DISC-07** | SimpleDataTable Props | Accepts `loadingText` and `emptyStateText` directly | Required `labels={{ loading, empty }}` and `emptyContent` | Add `loadingText` and `emptyStateText` to `SimpleDataTableProps` in `@shared/tables`. | Resolved & Verified |
| **DISC-08** | Executions Table Wrapper Height | `tableWrapperClassName='max-h-[34rem]'` | `tableWrapperClassName='max-h-120'` | Set `tableWrapperClassName='max-h-[34rem]'` matching reference. | Resolved & Verified |
| **DISC-09** | Column Header Sort Menu | Radix dropdown menu with Radix icons and Persian sort labels | Missing `presentation='reference'`, rendering default popover with English labels | Pass `presentation='reference'` to `DataTableColumnHeader` in both tables. | Resolved & Verified |
| **DISC-10** | Badge & Table Presentation | Compact reference badge styling and hover styles | Missing `presentation='reference'` on `Badge` and `TableActions` | Pass `presentation='reference'` to `Badge` and `TableActions`. | Resolved & Verified |

---

## 3. Disparity Tasks Breakdown

- **TASK-09**: Feature paths & exports (`pages/pipelines-page.tsx`, `data/pipeline-schema.ts`, `hooks/use-pipelines.ts`, route import).
- **TASK-10**: Shared table primitives parity (`TableActionButton` variant `'info'`, `SimpleDataTable` `loadingText` & `emptyStateText`).
- **TASK-11**: `PipelinesPage` and `ConfirmDialog` exact API parity.
- **TASK-12**: `PipelineJobsTable` and `PipelineExecutionsTable` styling, presentation, and wrapper height parity.
