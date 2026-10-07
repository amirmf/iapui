# TASK-04: Pipeline Jobs Table

Status: Completed

## Goal
Implement the `PipelineJobsTable` component rendering the list of available pipeline jobs with selection highlighting and start action.

## Reference Source
- `insurance-ui/src/features/pipelines/components/pipeline-jobs-table.tsx`

## Target File Location
- `apps/iap-admin/src/features/pipelines/components/pipeline-jobs-table.tsx`
- `apps/iap-admin/src/features/pipelines/components/pipeline-jobs-table.test.tsx`

## Component Structure & Props
```typescript
type PipelineJobsTableProps = {
  jobs: string[]
  selectedJobName: string | null
  pendingJobName: string | null
  isLoading: boolean
  onSelect: (jobName: string) => void
  onStart: (jobName: string) => void
}
```

## Internal Architecture & Clean Code
To maximize code readability and render performance:
1. Column definitions:
   - `job`: Link-styled button with `font-mono text-sm`. When `selectedJobName === jobName`, renders with `font-semibold text-primary`; otherwise `text-foreground`.
   - `actions`: Button with `size='sm'`, `IconPlayerPlay` icon, and `pipelines.actions.start` label. Disabled when `pendingJobName === jobName`. Column width: `w-28`.
2. Integration with `@shared/tables`:
   - `SimpleDataTable`
   - `DataTableColumnHeader`
   - `max-h-120` wrapper class
   - Loading text: `pipelines.loadingJobs`
   - Empty state text: `pipelines.emptyJobs`

## Acceptance Criteria
- Component name: `PipelineJobsTable`.
- Exact same column names, ids, styles, and action behavior as reference.
- Clean memoization for columns (`useMemo`).
- Unit tests verify selection callback, start callback, disabled state during pending, loading, and empty state.
