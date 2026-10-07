# Task 04: Table Columns and Actions

## Objective

Implement `AgentClaimRequestRowActions`, `AgentClaimRequestHeaderActions`, and `useAgentClaimRequestColumns` in `apps/iap-admin/src/features/agent-claim-requests/components/`.

## Reference Inspection

In `insurance-ui`:
- `src/features/agent-claim-requests/components/agent-claim-request-row-actions.tsx`:
  - `showCompletionDocumentsBtn`: `status === 'RETURN'`
  - `showGetFanavaranDataBtn`: `!claimRequest.extDisplayName && !claimRequest.extCustomerName && !claimRequest.extPlanCaption`
  - Links:
    - View Details: `/agent/claim-requests/$claimRequestId/claim-request-management`
    - Completion of Documents: `/agent/claim-requests/$claimRequestId`
  - Mutations:
    - `refreshPolicyDetails`: calls `agentClaimRequestService.refreshPolicyDetails`, invalidates `['agentClaimRequests']` and `['agentClaimRequest', id]`, shows toast `agent.claimRequests.messages.policyDetailsUpdated`.
  - Delete: sets current row and opens delete dialog.
- `src/features/agent-claim-requests/components/agent-claim-request-header-actions.tsx`:
  - Link to `/agent/claim-requests/create`
  - Excel export button with `agentClaimRequestService.exportPageLiteExcel`
  - Refresh button invoking `onRefetch()` with loading spinner
- `src/features/agent-claim-requests/components/agent-claim-request-columns.tsx`:
  - 10 visible column definitions (`extNationalCode`, `extDisplayName`, `businessKey`, `docType.id`, `amount`, `status`, `submitDate`, `extPolicyId`, `extWorkUnitName`, `extWorkUnitProvinceName`, `actions`).
  - 12 hidden column definitions.
  - TwoLineHeader and TwoLineCell used for compound presentation.
  - Return document status badge condition.

## Target Architecture

1. **Row Actions**:
   - `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-row-actions.tsx`
   - Use `TableActions` and `TableActionButton` with `presentation='reference'`.
   - Use `Permission` from `@iap/ui`.
   - Add unit test `agent-claim-request-row-actions.test.tsx`.
2. **Header Actions**:
   - `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-header-actions.tsx`
   - Use `ClaimRequestExportExcelButton` from `@features/claim-requests/pages/index/components/claim-request-export-excel-button`.
   - Add unit test `agent-claim-request-header-actions.test.tsx`.
3. **Columns**:
   - `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-columns.tsx`
   - Use `createColumnHelper` from `@tanstack/react-table`.
   - Use `TwoLineCell` and `TwoLineHeader` from `@shared/tables`.
   - Format dates with `formatDate` and `formatDateTime` from `@iap/ui`.
   - Add parity unit test `agent-claim-request-columns.test.tsx`.

## Acceptance Criteria

- All columns match the reference configuration, keys, and classes.
- Actions render the exact buttons, icons, permissions, tooltips, and mutation behaviors.
- Colocated tests pass.
