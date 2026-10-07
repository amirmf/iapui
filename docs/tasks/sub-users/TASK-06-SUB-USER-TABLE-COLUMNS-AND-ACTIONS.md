# TASK-06: Sub-User Table Columns and Actions

## Objective
Implement TanStack Table column definitions for Sub-Users along with row actions (view details, edit, release assignments, toggle active status) matching the reference implementation.

## Reference Source
- `insurance-ui/src/features/sub-users/components/sub-user-columns.tsx`
- `insurance-ui/src/features/sub-users/components/sub-user-row-actions.tsx`

## Implementation Target
1. `apps/iap-admin/src/features/sub-users/components/sub-user-columns.tsx`
2. `apps/iap-admin/src/features/sub-users/components/sub-user-row-actions.tsx`

## Detailed Specifications

### 1. Column Definitions (`useSubUserColumns`)
- `username`: Header `subUsers.columns.username` with `DataTableColumnHeader`
- `displayName`: Header `subUsers.columns.displayName`, fallback `-`
- `mobileNumber`: Header `subUsers.columns.mobileNumber`, fallback `-`
- `roles`: Badges with role colors and translated labels (`parties.role.*`), wrapping flex container.
- `status`: Badge with `subUsers.status.enabled` / `subUsers.status.disabled` and status colors.
- `actions`: Sticky left actions cell rendering `<SubUserRowActions row={row} />`.

### 2. Row Actions (`SubUserRowActions`)
- `TableActions` wrapper with `TableActionButton`:
  - **Details**: `IconEye`, sets `currentRow` and `open: 'details'`.
  - **Edit**: `IconEdit`, sets `currentRow` and `open: 'editor'`.
  - **Release Assignments**: `IconArchiveOff`, destructive variant, sets `currentRow` and `open: 'releaseAssignments'`.
  - **Toggle Status**: `IconUserOff` / `IconUser`, destructive variant, triggers `disable(user.id)`.

## Acceptance Criteria
- [ ] Columns match exact order and headers from reference.
- [ ] Badge styling matches design tokens and role color specifications.
- [ ] Row action tooltips and aria-labels properly translated.
