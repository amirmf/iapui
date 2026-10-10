# Task 04: Header, Filter, Card, and Pagination Components

## Objective
Build small, decoupled, accessible presentation components in `apps/iap-app/src/features/pre-auths/components/` with clean code and high performance.

## Components to Implement

### 1. `my-claim-request-page-header.tsx`
- Reference: `insurance-ui/src/features/my-iap/claim-requests/components/my-claim-request-page-header.tsx`
- Props: `title: string`, `description?: string`, `actions?: ReactNode`, `showBackButton?: boolean`, `backLink?: string`
- Renders page title with typography matching reference and action buttons slot.

### 2. `pre-auth-card.tsx`
- Reference: `insurance-ui/src/features/my-iap/pre-auths/components/pre-auth-card.tsx`
- Props: `{ preAuth: PreAuth }`
- Sub-components: `DetailRow` for compact, accessible `dt`/`dd` key-value pairs.
- Uses `@iap/ui` `Card`, `CardContent`, `Badge`, and `cn`.
- Dynamic border and badge colors driven by `pre-auth-status-constant.ts`.
- Formats amounts using `formatAmount` (`Intl.NumberFormat`).
- Displays illness description/ID, amount, franchise, issue date, reception date, validity dates, description.

### 3. `pre-auth-filter.tsx`
- Reference: `insurance-ui/src/features/my-iap/pre-auths/components/pre-auth-filter.tsx`
- Props: `onApply: (values: PreAuthFilterValues) => void`, `onClear: () => void`
- Form fields:
  - Policy select (`SearchableSelect` from `@iap/ui`): populated from `useGetMyInsurancePolicy` (module `insurance-policies`). Auto-selects first policy on load.
  - Insured person select (`SearchableSelect` from `@iap/ui`): populated from `useSubInsuredPeople(policyId)`. Resets when policy changes. Formats labels with national code and foreign flag.
- Watches form values and automatically calls `onApply` when both fields are selected, or `onClear` when either is missing.

### 4. `pagination.tsx`
- Reference: `insurance-ui/src/components/pagination.tsx`
- Props: `currentPage: number`, `totalPages?: number`, `totalElements?: number`, `hasNextPage?: boolean`, `onPageChange: (page: number) => void`, `isLoading?: boolean`, `className?: string`, `countTranslationKey?: string`
- Uses `@iap/ui` `Button` with `variant="outline"`.

## Performance & Clean Code Guidelines
- Keep components small and focused.
- Wrap callbacks with `useCallback` and collections with `useMemo`.
- Pure presentational primitives imported from `@iap/ui`.
