# TASK-11: Parity PipelinesPage & ConfirmDialog

Status: Completed

## Scope
1. `ConfirmDialog` Adapter:
   - Provide a component `apps/iap-admin/src/features/pipelines/components/confirm-dialog.tsx` that accepts reference props:
     - `open: boolean`
     - `onOpenChange: (open: boolean) => void`
     - `title: ReactNode`
     - `desc: ReactNode`
     - `confirmText?: ReactNode`
     - `cancelBtnText?: string`
     - `destructive?: boolean`
     - `isLoading?: boolean`
     - `handleConfirm: () => void`
   - Delegates to `@iap/dialogs` `ConfirmDialog` with `presentation='reference'`.
2. `PipelinesPage`:
   - Bind mutations directly to service methods: `mutationFn: pipelineService.start`, `mutationFn: pipelineService.stop`, `mutationFn: pipelineService.restart`.
   - Use `<ConfirmDialog open={...} onOpenChange={...} title={...} desc={...} confirmText={...} destructive isLoading={...} handleConfirm={...} />`.
