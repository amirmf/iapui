# TASK-05: Pipeline Executions Table

Status: Completed

## Goal
Implement the `PipelineExecutionsTable` component rendering executions of the selected job, execution metadata, details JSON accordion, and action buttons.

## Reference Source
- `insurance-ui/src/features/pipelines/components/pipeline-executions-table.tsx`

## Target File Location
- `apps/iap-admin/src/features/pipelines/components/pipeline-executions-table.tsx`
- `apps/iap-admin/src/features/pipelines/components/pipeline-executions-table.test.tsx`

## Component Structure & Props
```typescript
type PipelineExecutionsTableProps = {
  executions: PipelineExecution[]
  isLoading: boolean
  isError: boolean
  pendingExecutionId: number | null
  onRetry: () => void
  onStop: (executionId: number) => void
  onRestart: (executionId: number) => void
}
```

## Columns Specification
1. `executionId`:
   - Accessor: `getExecutionId(execution)` (looks up `executionId` or `id` from integer keys).
   - Cell: `<span className='font-mono text-xs'>{id ?? '—'}</span>`
2. `status`:
   - Accessor: `readExecutionValue(execution, ['status', 'batchStatus'])`
   - Cell: `<Badge variant={statusVariant(status)}>{status}</Badge>`
3. `startedAt`:
   - Accessor: `readExecutionValue(execution, ['startTime', 'startedAt'])`
4. `endedAt`:
   - Accessor: `readExecutionValue(execution, ['endTime', 'endedAt'])`
5. `details`:
   - Cell: Collapsible `<details className='max-w-80'>` containing `<summary>{t('pipelines.actions.viewDetails')}</summary>` and formatted `<pre className='mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted p-2 text-xs'>{JSON.stringify(row.original, null, 2)}</pre>`
6. `actions`:
   - Cell: `TableActions` with:
     - Stop: `TableActionButton` with `IconPlayerStop`, `pipelines.actions.stop`, variant `destructive`, disabled when id is null or pending.
     - Restart: `TableActionButton` with `IconRotate`, `pipelines.actions.restart`, variant `info`, disabled when id is null or pending.
   - Column width: `w-24`.

## Error State & Empty/Loading States
- If `isError`: renders error alert with message `pipelines.errors.executions` and retry button with `IconRefresh`.
- Table rendering: `SimpleDataTable` with `max-h-[34rem]`, `loadingText: t('pipelines.loadingExecutions')`, `emptyStateText: t('pipelines.emptyExecutions')`.

## Acceptance Criteria
- Component name: `PipelineExecutionsTable`.
- Helper functions isolated and clean.
- Unit tests verify column rendering, status badge variants, details inspection, stop/restart clicks, error state, and retry action.
