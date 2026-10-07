# Task 06: Verification and Quality Gates

## Objective

Run end-to-end typechecking, linting, routing integration tests, and build checks to ensure complete parity and regression prevention.

## Verification Checklist

1. **Unit & Integration Tests**:
   - `agent-claim-request-service.test.ts`
   - `agent-claim-request-constant.test.ts`
   - `agent-claim-request-delete-dialog.test.tsx`
   - `agent-claim-request-columns.test.tsx`
   - `agent-claim-request-row-actions.test.tsx`
   - `agent-claim-request-header-actions.test.tsx`
   - `agent-claim-requests-page.test.tsx`
   - `src/shared/router/panel-routes.test.ts`
2. **Quality Gates**:
   - `pnpm --filter iap-admin typecheck`
   - `pnpm --filter iap-admin lint`
   - `pnpm architecture:check`
   - `pnpm --filter iap-admin build`
   - `git diff --check`
3. **Parity Audit**:
   - Verify every UI element against `insurance-ui/src/features/agent-claim-requests/pages/agent-claim-requests-page.tsx`.
   - Confirm all Persian text values match reference `src/locales/fa.json`.
