# TASK-07: Page Composition and Route Integration

Status: Completed

## Goal
Implement `PipelinesPage` in `features/pipelines/pipelines-page.tsx`, expose it through the feature barrel `features/pipelines/index.ts`, and wire the file route in `apps/iap-admin/src/app/router/routes/_authenticated/pipelines/index.tsx`.

## Reference Source
- Page: `insurance-ui/src/features/pipelines/pages/pipelines-page.tsx`
- Route: `insurance-ui/src/routes/_authenticated/pipelines/index.tsx`

## Target File Locations
- `apps/iap-admin/src/features/pipelines/pipelines-page.tsx`
- `apps/iap-admin/src/features/pipelines/index.ts`
- `apps/iap-admin/src/app/router/routes/_authenticated/pipelines/index.tsx`

## Details

### 1. `PipelinesPage`
- Uses `Main` layout from `@shared/components/layout/main`.
- Header:
  - Title: `pipelines.title`
  - Refresh button: `pipelines.actions.refresh` with `IconRefresh` (animated spin while `isRefreshing`), triggers `refetch()` for jobs and executions.
- Jobs error alert: renders if `jobsQuery.isError` with retry button.
- Section 1: Jobs Table (`PipelineJobsTable`). First job automatically selected by `useEffect` when jobs load or change.
- Section 2: Executions Table (`PipelineExecutionsTable`).
  - Section title: `pipelines.executionsTitle`.
  - Section description: `pipelines.executionsDescription` (`{ jobName: selectedJobName }`) or `pipelines.selectJob` if no job selected.
- Confirm Dialog: `ConfirmDialog` for stopping an execution.
- Mutations:
  - `startMutation`: `pipelineService.start`, on success invalidates `pipelineQueryKeys.all`, shows `toast.success(t('pipelines.messages.started'))`.
  - `stopMutation`: `pipelineService.stop`, on success invalidates `pipelineQueryKeys.all`, resets `executionToStop`, shows `toast.success(t('pipelines.messages.stopped'))`.
  - `restartMutation`: `pipelineService.restart`, on success invalidates `pipelineQueryKeys.all`, shows `toast.success(t('pipelines.messages.restarted'))`.

### 2. Feature Public Barrel (`index.ts`)
```typescript
export { PipelinesPage } from './pipelines-page'
export { default } from './pipelines-page'
export * from './constants/pipeline-constant'
export * from './queries/use-pipelines'
export * from './services/pipeline-service'
```

### 3. Route (`routes/_authenticated/pipelines/index.tsx`)
```typescript
import { PipelinesPage } from '@features/pipelines'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pipelines/')({
  component: PipelinesPage,
  loader: () => ({ crumb: 'pipelines' }),
})
```

## Acceptance Criteria
- Route file remains thin and delegates to `PipelinesPage`.
- Breadcrumb loader specifies `crumb: 'pipelines'`.
- Mutation invalidation, toast messages, and refresh spin match reference behavior.
