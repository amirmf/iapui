# TASK-04: UI Store and State Management

## Objective
Implement feature-scoped Zustand store for client UI state (dialog visibility, selected row, and table row selection) according to the `APPLICATION-ARCHITECTURE.md` conventions (`context/store/`).

## Reference Source
- `insurance-ui/src/features/assignement-rules/context/assignement-rule-context.tsx`

## Implementation Target
- `apps/iap-admin/src/features/assignement-rules/context/store/assignement-rule-store.ts`
- `apps/iap-admin/src/features/assignement-rules/context/store/assignement-rule-store.test.ts`
- Helper for selected IDs: `apps/iap-admin/src/features/assignement-rules/model/assignement-rule-row-selection.ts`

## 1. Store Implementation (`assignement-rule-store.ts`)
```ts
import type { AssignementRule } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type AssignementRuleDialogType =
  | 'create'
  | 'edit'
  | 'delete'
  | 'bulkDelete'

export interface AssignementRuleState {
  currentRow: AssignementRule | null
  openDialog: AssignementRuleDialogType | null
  rowSelection: RowSelectionState
  reset: () => void
  setCurrentRow: (row: AssignementRule | null) => void
  setOpenDialog: (open: AssignementRuleDialogType | null) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

const initialState = {
  currentRow: null,
  openDialog: null,
  rowSelection: {},
}

export const useAssignementRuleStore = create<AssignementRuleState>((set) => ({
  ...initialState,
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
  reset: () => set(initialState),
}))
```

## 2. Row Selection Helper (`assignement-rule-row-selection.ts`)
Pure helper to safely extract IDs of selected rows given the current page rows:
```ts
import type { AssignementRule } from '@iap/api-types'
import type { RowSelectionState } from '@tanstack/react-table'

export function getSelectedAssignementRuleIds(
  rowSelection: RowSelectionState,
  rows: AssignementRule[]
): string[] {
  return Object.entries(rowSelection)
    .filter(([, selected]) => Boolean(selected))
    .map(([rowId]) => rows[Number(rowId)]?.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
}
```

## 3. Unit Tests
- Test initial state values.
- Test setting and clearing `openDialog` and `currentRow`.
- Test updater function and direct value on `setRowSelection`.
- Test `reset()` clearing all state.
- Test `getSelectedAssignementRuleIds` helper with populated and empty row selections.

## Acceptance Criteria
- [ ] Conforms to `APPLICATION-ARCHITECTURE.md`: Lives in `context/store/`, does NOT hold server state or route state.
- [ ] Clean Zustand 5 usage with explicit typing and selectors.
- [ ] 100% test coverage for store actions and helper.
