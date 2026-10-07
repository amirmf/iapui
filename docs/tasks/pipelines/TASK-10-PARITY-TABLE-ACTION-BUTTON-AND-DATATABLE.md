# TASK-10: Parity Shared Table Primitives

Status: Completed

## Scope
1. `TableActionButton`:
   - Support reference action variants: `'default' | 'destructive' | 'success' | 'primary' | 'info'`.
   - When `variant === 'info'`, render `text-blue-700 hover:bg-blue-100 hover:text-blue-700`.
   - When `variant === 'destructive'`, render `text-destructive hover:bg-red-100 hover:text-destructive`.
   - When `variant === 'success'`, render `text-green-700 hover:bg-green-100 hover:text-green-700`.
   - When `variant === 'primary'`, render `text-primary-700 hover:bg-primary-100 hover:text-primary-700`.
2. `SimpleDataTable`:
   - Support `loadingText?: ReactNode` (alias for `labels.loading`).
   - Support `emptyStateText?: ReactNode` (alias for `emptyContent` / `labels.empty`).
