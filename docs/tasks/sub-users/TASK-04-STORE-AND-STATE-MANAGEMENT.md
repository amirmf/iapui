# TASK-04: Store and State Management

## Objective
Implement feature-scoped Zustand stores and context providers for client state coordination (dialog visibility, selected row states, and cross-section selections) adhering to `context/store/` and `context/provider/` architecture standards.

## Reference Source
- `insurance-ui/src/features/sub-users/context/sub-user-context.tsx`
- `insurance-ui/src/features/sub-users/context/sub-users-agreements-context.tsx`

## Implementation Target
1. `apps/iap-admin/src/features/sub-users/context/store/sub-user-store.ts`
2. `apps/iap-admin/src/features/sub-users/context/provider/sub-user-provider.tsx`
3. `apps/iap-admin/src/features/sub-users/context/store/sub-users-agreements-store.ts`
4. `apps/iap-admin/src/features/sub-users/context/provider/sub-users-agreements-provider.tsx`

## Detailed Specifications

### 1. Sub-User Store (`sub-user-store.ts`)
```ts
export type SubUserDialogType = 'details' | 'editor' | 'releaseAssignments'

export interface SubUserState {
  open: SubUserDialogType | null
  setOpen: (open: SubUserDialogType | null) => void
  currentRow: SubUser | null
  setCurrentRow: (currentRow: SubUser | null) => void
  rowSelection: RowSelectionState
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  selectedUserAccount: UserAccount[]
  setSelectedUserAccount: (selectedUserAccount: UserAccount[]) => void
  reset: () => void
}
```

### 2. Sub-User Agreement Selection Store (`sub-users-agreements-store.ts`)
```ts
export interface SubUsersAgreementsState {
  rowSelection: RowSelectionState
  selectedAgreement: Agreement[]
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  setSelectedAgreement: (agreements: Agreement[]) => void
  reset: () => void
}
```

### 3. Lifecycle Providers
- `SubUserProvider`: resets `useSubUserStore` on component unmount.
- `SubUsersAgreementsProvider`: resets `useSubUsersAgreementsStore` on component unmount.

## Acceptance Criteria
- [ ] No server state in Zustand (only dialogs, rowSelection, selected entities).
- [ ] Clean unmount reset prevents stale modal/selection state when navigating away.
- [ ] Unit tests for store mutations and reset behavior.
