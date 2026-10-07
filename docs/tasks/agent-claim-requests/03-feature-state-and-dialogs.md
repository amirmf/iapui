# Task 03: Feature State and Delete Dialog

## Objective

Implement the feature-scoped client state (Zustand store and React Provider) and the delete confirmation dialog `AgentClaimRequestDeleteDialog`.

## Reference Inspection

In `insurance-ui`:
- `src/features/agent-claim-requests/context/claim-request-context.tsx`:
  - `useAgentClaimRequestStore`: state contains `open: 'delete' | null`, `currentRow: ClaimRequest | null`, `setOpen`, `setCurrentRow`, `reset`.
  - `AgentClaimRequestProvider`: executes `reset()` on unmount.
- `src/features/agent-claim-requests/components/agent-claim-request-delete-dialog.tsx`:
  - Uses `ConfirmDialog` with `open === 'delete'`.
  - Mutates `agentClaimRequestService.delete`.
  - On success: invalidates `['agentClaimRequests']`, calls optional `refetch()`, toasts `agent.claimRequests.messages.deleted`, closes dialog.

## Target Architecture

1. **State Organization**:
   - `apps/iap-admin/src/features/agent-claim-requests/context/store/agent-claim-request-store.ts`:
     Zustand store for dialog state and currentRow.
   - `apps/iap-admin/src/features/agent-claim-requests/context/provider/agent-claim-request-provider.tsx`:
     Context provider cleaning up state on unmount.
   - `apps/iap-admin/src/features/agent-claim-requests/context/index.ts`:
     Clean barrel export for feature context.
2. **Dialog Component**:
   - `apps/iap-admin/src/features/agent-claim-requests/components/agent-claim-request-delete-dialog.tsx`:
     Uses `ConfirmDialog` from `@iap/dialogs` with `presentation='reference'`.
     Matches reference accessibility and behavior.
   - Colocate unit test `agent-claim-request-delete-dialog.test.tsx`.

## Acceptance Criteria

- Store resets on provider unmount.
- Delete dialog correctly calls `agentClaimRequestService.delete`.
- Invalidates TanStack Query cache `['agentClaimRequests']` and displays Persian success toast.
