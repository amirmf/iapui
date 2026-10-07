# TASK-12: Parity Tables & Presentation

Status: Completed

## Scope
1. `PipelineJobsTable`:
   - Pass `presentation='reference'` to `DataTableColumnHeader` for exact Radix dropdown sort menu.
   - Use `loadingText={t('pipelines.loadingJobs')}` and `emptyStateText={t('pipelines.emptyJobs')}` on `SimpleDataTable`.
2. `PipelineExecutionsTable`:
   - Use `variant='info'` on restart `TableActionButton`.
   - Pass `presentation='reference'` to `DataTableColumnHeader`, `Badge`, and `TableActions`.
   - Set `tableWrapperClassName='max-h-[34rem]'` matching reference.
   - Use `loadingText={t('pipelines.loadingExecutions')}` and `emptyStateText={t('pipelines.emptyExecutions')}` on `SimpleDataTable`.
