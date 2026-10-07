# TASK-04: UI Stores and State Management

## Objective
Implement UI Zustand stores and lifecycle cleanup providers for Support Questions, Support Pages, and Support Features according to `APPLICATION-ARCHITECTURE.md`.

## Scope of Work

### 1. Questions Store & Provider
- Location:
  - Store: `apps/iap-admin/src/features/support-questions/context/store/support-question-store.ts`
  - Provider: `apps/iap-admin/src/features/support-questions/context/provider/support-question-provider.tsx`
- State:
  - `open`: `'create' | 'edit' | 'view' | 'delete' | 'bulkDelete' | null`
  - `currentRow`: `SupportQuestion | null`
  - `rowSelection`: `RowSelectionState`
  - Actions: `setOpen`, `setCurrentRow`, `setRowSelection`, `reset`
- Provider: Calls `reset()` on unmount.

### 2. Pages Store & Provider
- Location:
  - Store: `apps/iap-admin/src/features/support-questions/context/store/support-page-store.ts`
  - Provider: `apps/iap-admin/src/features/support-questions/context/provider/support-page-provider.tsx`
- State:
  - `open`: `'create' | 'edit' | 'delete' | null`
  - `currentRow`: `SupportPage | null`
  - Actions: `setOpen`, `setCurrentRow`, `reset`

### 3. Features Store & Provider
- Location:
  - Store: `apps/iap-admin/src/features/support-questions/context/store/support-feature-store.ts`
  - Provider: `apps/iap-admin/src/features/support-questions/context/provider/support-feature-provider.tsx`
- State:
  - `open`: `'create' | 'edit' | 'delete' | null`
  - `currentRow`: `SupportFeature | null`
  - Actions: `setOpen`, `setCurrentRow`, `reset`

## Verification Criteria
- Unit tests verifying store transitions and cleanup on unmount.
