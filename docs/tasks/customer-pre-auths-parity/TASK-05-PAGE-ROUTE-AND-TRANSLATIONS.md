# Task 05: Page Component, Route Wiring, and Translations

## Objective
Assemble `PreAuthsPage`, wire the file route in `apps/iap-app`, add `@iap/dialogs` dependency, and add Persian localization strings.

## Implementation Details

### 1. `PreAuthsPage`
- Location: `apps/iap-app/src/features/pre-auths/pages/index/pre-auths-page.tsx`
- Orchestrates:
  - Page state (`page`, default `0`, `PAGE_SIZE = 9`)
  - Filter state (`filters: PreAuthFilterValues | null`)
  - TanStack Query `usePreAuths(request)`
  - Dual pagination controls (top and bottom of cards grid)
  - Responsive 3-column grid (`w-full md:w-1/2 lg:w-1/3 px-2 mb-4`)
  - Empty states (prompt to select filters when `!filters`, empty result message when query returns no items)
  - `ConfirmDialog` from `@iap/dialogs` for automatic page retreat when a page > 0 becomes empty.
  - Refetch button with spinning refresh icon when fetching.

### 2. Route Wiring
- File: `apps/iap-app/src/app/router/routes/_authenticated/pre-auths/index.tsx`
- Replaces `PlaceholderPage` with `PreAuthsPage` exported from `@features/pre-auths`.
- Preserves `loader: () => ({ crumb: 'preAuths' })`.

### 3. Package Dependency
- Add `"@iap/dialogs": "workspace:*"` to `apps/iap-app/package.json` for `ConfirmDialog`.

### 4. Persian Translation Keys
- Add to `apps/iap-app/src/shared/i18n/locales/fa/common.json` under `myiap.preAuths`:
  - `title`, `description`, `refresh`, `selectFilters`, `empty`, `emptyDescription`, `pagination`
  - `filters.policy`, `filters.selectPolicy`, `filters.insuredPerson`, `filters.selectInsuredPerson`, `filters.apply`
  - `fields.amount`, `fields.franchise`, `fields.description`, `fields.illnessDescription`, `fields.illnessId`, `fields.issueDate`, `fields.receptionDate`, `fields.validityBeginDate`, `fields.validityEndDate`, `fields.status`
  - `status.draft`, `status.approved`, `status.cancelled`
  - `endOfListDialog.title`, `endOfListDialog.desc`
