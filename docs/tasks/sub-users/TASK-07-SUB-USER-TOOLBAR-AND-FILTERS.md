# TASK-07: Sub-User Toolbar and Filters

## Objective
Implement `SubUsersDataTableToolbar` providing URL-synced text filtering and faceted status filtering for the Sub-Users data table.

## Reference Source
- `insurance-ui/src/features/sub-users/components/sub-users-data-table-toolbar.tsx`

## Implementation Target
- `apps/iap-admin/src/features/sub-users/components/sub-users-data-table-toolbar.tsx`

## Detailed Specifications

### 1. Text Filter Configurations
- `username`: Placeholder `subUsers.filters.username`
- `displayName`: Placeholder `subUsers.filters.displayName`
- `mobileNumber`: Placeholder `subUsers.filters.mobileNumber`

### 2. Faceted Filter Configurations
- `status`:
  - Title: `subUsers.columns.status`
  - Options:
    - `{ value: 'enabled', label: t('subUsers.status.enabled') }`
    - `{ value: 'disabled', label: t('subUsers.status.disabled') }`

### 3. Composition
- Uses `TableFilterQueryParams` from `@shared/tables`:
  ```tsx
  <TableFilterQueryParams
    textFilters={textFilters}
    facetedFilters={facetedFilters}
    showReset
  />
  ```

## Acceptance Criteria
- [ ] Debounced input synchronization with URL search parameters.
- [ ] Faceted filter toggles both single and multiple selections seamlessly.
- [ ] Reset button clears active filters and resets pagination to page 0.
