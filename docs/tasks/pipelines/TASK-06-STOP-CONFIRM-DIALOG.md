# TASK-06: Stop Execution Confirmation Dialog

Status: Completed

## Goal
Implement or wire the destructive confirmation dialog for stopping a running pipeline execution using the shared `@iap/dialogs` primitive.

## Reference Source
- `insurance-ui/src/features/pipelines/pages/pipelines-page.tsx` (lines 163–176)
- `insurance-ui/src/components/dialogs/confirm-dialog.tsx`

## Dialog Specification
Uses `ConfirmDialog` from `@iap/dialogs`:
- `open={executionToStop !== null}`
- `onOpenChange={(open) => !open && setExecutionToStop(null)}`
- `title={t('pipelines.stopDialog.title')}`
- `description={t('pipelines.stopDialog.description')}`
- `confirmLabel={t('pipelines.actions.stop')}`
- `confirmVariant='destructive'`
- `presentation='reference'`
- `isLoading={stopMutation.isPending}`
- `onConfirm={() => { if (executionToStop !== null) stopMutation.mutate({ executionId: executionToStop }) }}`

## Acceptance Criteria
- Matches reference dialog text, destructive button style, pending loading state, and cancellation behavior.
- Keeps dialog open during mutation in flight; closes upon successful mutation.
