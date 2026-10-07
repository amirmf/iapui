# TASK-08: Testing and Validation

Status: Completed

## Goal
Implement automated unit and component tests verifying pipeline contracts, service layer, constants, table components, and page integration; run project quality gates.

## Target Test Files
- `apps/iap-admin/src/features/pipelines/constants/pipeline-constant.test.ts`
- `apps/iap-admin/src/features/pipelines/services/pipeline-service.test.ts`
- `apps/iap-admin/src/features/pipelines/components/pipeline-jobs-table.test.tsx`
- `apps/iap-admin/src/features/pipelines/components/pipeline-executions-table.test.tsx`
- `apps/iap-admin/src/features/pipelines/pipelines-page.test.tsx`

## Test Scope
1. **Constant Tests**:
   - `getPipelineExecutionStatusVariant`: tests `'FAIL'`, `'STOP'`, `'COMPLETED'`, `'SUCCESS'`, and unknown strings.
   - `PIPELINE_EXECUTION_ID_KEYS`: ensures presence of `executionId` and `id`.
2. **Service Tests**:
   - Verify request schema validation, endpoint paths, method (GET/POST), encodeURIComponent on jobName, integer executionId in URL, and response schema parsing.
3. **Jobs Table Tests**:
   - Renders jobs, highlights active job, fires `onSelect`, fires `onStart`, disables pending button, renders loading and empty states.
4. **Executions Table Tests**:
   - Extracts ID safely, renders badges with appropriate variant, renders dates and details JSON, handles stop and restart callbacks, renders error alert with retry button.
5. **Page Integration Tests**:
   - Renders header, triggers refresh, displays jobs and executions, opens confirm dialog on stop, triggers mutations, shows toasts.

## Verification Checklist
- `pnpm --filter @iap/api-types typecheck`
- `pnpm --filter iap-admin typecheck`
- `pnpm --filter iap-admin test`
- `pnpm --filter iap-admin lint`
- `pnpm --filter iap-admin build`
- `git diff --check`
