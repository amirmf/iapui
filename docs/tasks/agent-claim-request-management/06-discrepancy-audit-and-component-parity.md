# Discrepancy Audit and Component-by-Component Parity Matrix

## Scope

Line-by-line parity comparison of `AgentClaimRequestManagement` and its entire mounted closure between reference (`insurance-ui`) and target (`iap-admin`).

## Component Closure Comparison Matrix

| # | Reference Component (`insurance-ui`) | Reference File Location | Target State in `iap-admin` | Discrepancy / Action Required |
|---|---|---|---|---|
| 1 | `Route` (`/agent/claim-requests/$claimRequestId/claim-request-management/`) | `src/routes/agent/claim-requests/$claimRequestId/claim-request-management/index.tsx` | Placeholder (`apps/iap-admin/src/app/router/routes/_agent/agent/claim-requests/$claimRequestId.claim-request-management/index.tsx`) | **GAP**: Replace `PlaceholderPage` with prefetching loader (`agentClaimRequestManagementQueryOptions`), `crumb: 'claimDetails'`, `pendingComponent: ClaimRequestManagementPanelPending`, `pendingMs: 200`, `pendingMinMs: 200`, `errorComponent: ClaimRequestManagementQueryError`, `component: AgentClaimRequestManagement`. |
| 2 | `AgentClaimRequestManagement` | `src/features/agent-claim-requests/pages/agent-claim-request-management.tsx` | Missing in `apps/iap-admin/src/features/agent-claim-requests/` | **GAP**: Create `apps/iap-admin/src/features/agent-claim-requests/pages/agent-claim-request-management.tsx` with identical layout, imports, branching (`isLoading`, `isError \|\| !claimRequest`), parameter extraction, and section order. |
| 3 | `useAgentClaimRequestManagementData` & `agentClaimRequestManagementQueryOptions` | `src/features/agent-claim-requests/hooks/use-agent-claim-request-management-data.ts` | Missing in `apps/iap-admin/src/features/agent-claim-requests/` | **GAP**: Create `apps/iap-admin/src/features/agent-claim-requests/queries/use-agent-claim-request-management-data.ts` querying `agentClaimRequestService.getById(claimRequestId, { signal })` with `queryKey: ['agentClaimRequest', claimRequestId]`. |
| 4 | `ClaimRequestLastStatusSection` | `src/features/claim-requests/components/claim-request-last-status-section.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel so `agent-claim-requests` can import it without boundary violation (`feature-public-api-only`). |
| 5 | `ClaimRequestAssignSection` | `src/features/claim-requests/components/claim-request-assign-section.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. |
| 6 | `ClaimRequestInfoList` | `src/features/claim-requests/components/claim-request-info-list.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. Pass `viewDetailsAdjustmentLink='/agent/claim-requests/$claimRequestId/claim-request-management/'`. |
| 7 | `ClaimRequestAssessmentItemsSection` | `src/features/claim-requests/components/claim-request-assessment-items-section.tsx` | Implemented in `@features/assessment-items` and re-exported in `claim-requests` | **GAP**: Export from `@features/claim-requests` public barrel. |
| 8 | `ClaimRequestDoctorResponses` | `src/features/claim-requests/components/claim-request-doctor-responses.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. |
| 9 | `ClaimRequestDuplicatedSection` | `src/features/claim-requests/components/duplicated/claim-request-duplicated-section.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/duplicated/` | **GAP**: Export from `@features/claim-requests` public barrel. Matches reference with `useIsAgentPanel()` prefixing target link with `/agent`. |
| 10 | `ClaimRequestManagementError` | `src/features/claim-requests/components/claim-request-management-error.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. |
| 11 | `ClaimRequestObjectionSection` | `src/features/claim-requests/components/claim-request-objection-section.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. Enforces `!isAgentPanel` permission guard. |
| 12 | `ClaimRequestAttachmentsSection` | `src/features/claim-requests/components/claim-request-attachments-section.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. |
| 13 | `ClaimRequestManagementPrevRequest` | `src/features/claim-requests/components/claim-request-management-prev-request/index.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. |
| 14 | `ClaimRequestDocumentsSection` | `src/features/claim-requests/components/claim-request-documents-section.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. Enforces `!isAgentPanel` permission guard. |
| 15 | `ClaimRequestManagementPanelPending` | `src/features/claim-requests/components/claim-request-management-pending.tsx` | Implemented in `claim-requests/pages/claim-request-management/components/` | **GAP**: Export from `@features/claim-requests` public barrel. |
| 16 | `ClaimRequestManagementQueryError` | `src/features/claim-requests/components/claim-request-management-query-error.tsx` | Already exported in `@features/claim-requests` | Verified: No discrepancy. |
| 17 | `agentClaimRequestService.getById` | `src/features/agent-claim-requests/services/agent-claim-request-service.ts` | Implemented in `apps/iap-admin/src/features/agent-claim-requests/services/agent-claim-request-service.ts` | Verified: Exact endpoint `GET /claim-request-registery-agent/claim-requests/{id}` and schema parse. |
| 18 | Translations (`claimRequests.*`, `claimDetails`) | `src/locales/fa.json` | Present in `apps/iap-admin/src/shared/i18n/locales/fa/common.json` | Verified: All keys exist verbatim. |
| 19 | Feature Public API | `src/features/agent-claim-requests/index.ts` | Missing exports for management page | **GAP**: Export `AgentClaimRequestManagement`, `useAgentClaimRequestManagementData`, `agentClaimRequestManagementQueryOptions` from `@features/agent-claim-requests`. |
| 20 | Test Coverage | N/A | Missing test files for agent management page | **GAP**: Add unit and integration tests covering query options, loading, error, success render, and route integration. |

## Discrepancies vs Admin Operations Page

1. **Header Layout**:
   - Operations page renders: `ClaimRequestLastStatusSection`, `ClaimRequestAssignSection`, `ClaimRequestRegisteredByAgentSection`, `ClaimRequestQuickButtons`.
   - Agent page renders: ONLY `ClaimRequestLastStatusSection`, `ClaimRequestAssignSection`.
2. **Review Switcher vs Duplicates**:
   - Operations page renders `ClaimRequestReviewSwitcherSection`.
   - Agent page renders `ClaimRequestDuplicatedSection`.
3. **Action Buttons**:
   - Operations page renders `ClaimRequestManagementActionBtn`.
   - Agent page comments out action buttons (`{/*<ClaimRequestManagementActionBtn />*/}`).
4. **Adjustment Detail Link**:
   - Operations page links to `/claim-requests/$claimRequestId/claim-request-management/`.
   - Agent page links to `/agent/claim-requests/$claimRequestId/claim-request-management/`.
5. **Permissions**:
   - Agent cannot submit internal objections (`!isAgentPanel` guard in `ClaimRequestObjectionSection`).
   - Agent cannot manage documents (`!isAgentPanel` guard in `ClaimRequestDocumentsSection`).
