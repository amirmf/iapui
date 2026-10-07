# Task 03 — feature context store

Reference: `insurance-ui/src/features/dashboard/context/report-show-report.ts`.
Target owner: `apps/iap-admin/src/features/dashboard/context/store/report-show-report-store.ts`.

## Responsibilities

1. Feature client state ownership:
   - According to `APPLICATION-ARCHITECTURE.md`, Zustand stores belong in `context/store/`.
   - Implement `useShowReport` Zustand store with:
     - `isShowReport: boolean` (initial: `false`)
     - `toggleShowReport: () => void` (toggles boolean)
2. Decouple page state from local `useState`:
   - Replace local `useState(false)` in `dashboard-page.tsx` with `useShowReport`.
   - Preserve user toggle state across component lifecycle and sub-navigation as in reference.

## Acceptance criteria

- `useShowReport` Zustand store behaves identically to reference.
- Unit test in `report-show-report-store.test.ts` verifies initial state and toggle action.
- Store resides strictly under `context/store/`.
