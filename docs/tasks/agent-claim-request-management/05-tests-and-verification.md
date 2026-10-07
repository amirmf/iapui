# Task 05: Tests and Verification

## Objective

Validate implementation through focused unit, integration, and architecture tests.

## Test Coverage Checklist

1. **Query & Service Hook (`use-agent-claim-request-management-data.test.ts` or page integration test)**:
   - Verify `agentClaimRequestManagementQueryOptions` generates queryKey `['agentClaimRequest', claimRequestId]`.
   - Verify query calls `agentClaimRequestService.getById(claimRequestId)`.
2. **Page Component Tests (`agent-claim-request-management.test.tsx`)**:
   - Renders pending skeleton (`ClaimRequestManagementPanelPending`) while loading.
   - Renders error component (`ClaimRequestManagementQueryError`) on query error.
   - Renders header status and assignment sections.
   - Passes correct `/agent/claim-requests/$claimRequestId/claim-request-management/` link to `ClaimRequestInfoList`.
   - Renders left card sections (`ClaimRequestAssessmentItemsSection`, `ClaimRequestDoctorResponses`, `ClaimRequestDuplicatedSection`, `ClaimRequestManagementError`, `ClaimRequestObjectionSection`).
   - Renders `ClaimRequestAttachmentsSection`.
   - Renders previous requests table when `createdBy` is present.
   - Renders documents section with agent permission guard.
3. **Route Integration Tests**:
   - Verify route loader, prefetch options, and breadcrumb `claimDetails`.

## Verification Commands

1. `pnpm --filter iap-admin typecheck` (zero TypeScript errors)
2. `pnpm --filter iap-admin lint` (zero ESLint warnings/errors)
3. `pnpm architecture:check` (zero boundary violations)
4. `pnpm --filter iap-admin test <test-paths>` (all new and affected tests pass)
5. `pnpm --filter iap-admin build` (production build succeeds)
