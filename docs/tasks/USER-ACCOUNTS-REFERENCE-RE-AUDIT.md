# User Accounts reference re-audit

## Scope

- Target: `apps/iap-admin/src/features/user-account`
- Reference: `/home/sadegh/Android/project/insurance-ui/src/features/user-account`
- Source page: `ui/user-accounts-page.tsx` ↔ `pages/user-account-page.tsx`
- Audit date: 2026-09-28

## Comparison tasks

| ID | Area | Result | Status |
| --- | --- | --- | --- |
| UA-01 | Page query, pagination, filters, loading/empty state, refresh | Equivalent; target uses the documented TanStack Router table-search adapter. | Complete |
| UA-02 | Create permission and row-action permission | Equivalent; target uses `isAdminRole` instead of the reference `Permission` wrapper. | Complete |
| UA-03 | Dialog workflow | Equivalent; target Zustand store and `UserAccountDialogs` replace the reference context and individual mounts. | Complete |
| UA-04 | Toolbar, columns, row actions, forms, branch selector, reset/delete/view, special-disease workflow | Equivalent behavior; target composes shared `@iap/ui`, forms, table, and module public APIs. | Complete |
| UA-05 | User-account API paths, methods, parameters, request parsing, response parsing | Equivalent for every reference operation. Target additionally accepts `AbortSignal` where its shared transport supports cancellation. | Complete |
| UA-06 | User-account Zod contracts | Equivalent field validation, optionality, loose response handling, and inferred types. Target ownership is `@iap/api-types`, as required by `APPLICATION-ARCHITECTURE.md`. | Complete |
| UA-07 | Form Zod schemas | Equivalent defaults, validation rules, refinements, and messages. Target correctly exposes Zod input types to React Hook Form. | Complete |
| UA-08 | Persian translations consumed by this feature | Exact JSON equality for the full `parties` object. | Complete |

## Recorded differences

These are architecture-preserving adaptations, not product or contract gaps.

| Reference implementation | Target implementation | Reason |
| --- | --- | --- |
| `Main` page wrapper | Admin shell route composition | The target shell owns page layout; the feature keeps page composition local. |
| Legacy table query-sync hook | `parseTableFilterSearch` / `toTableFilterSearch` | Required admin table architecture; URL state and filter semantics are preserved. |
| Context with `open` and `currentRow` | Feature-scoped Zustand store | Required target state convention; dialog state remains feature-local. |
| Direct local components/utilities | Public APIs from `@iap/ui`, `@iap/forms`, `@shared/tables`, and target modules | Prevents duplicate cross-application primitives and preserves dependency direction. |
| `createApiClient()` | `getApiClient()` | Required target API-client ownership; endpoints and parsed values are unchanged. |
| Feature-local contracts | `@iap/api-types` contracts | Required shared package contract ownership. |
| `spacial` component spelling | `special` component spelling | Corrected target filename only; dialog behavior and translation keys are unchanged. |

## Translation note

`auth.validation.usernameMaxLength` and `auth.validation.usernamePattern` are
called by both implementations but absent from the reference Persian locale.
They intentionally remain unresolved; adding guessed wording would break exact
reference parity.

## Implementation outcome

No source implementation change is required: all identified parity tasks were
already completed on `main`. This re-audit adds only this evidence document.

## Architecture follow-up

The subsequent architecture audit corrected the following target-only issues
without changing reference behavior:

- Route search is validated by the strict, feature-owned
  `userAccountRouteSearchSchema` before table parsing and is subscribed through
  `useRouterState`.
- Page and feature UI use the local `useTranslate` helper and `Permission`
  primitive required by architecture documentation.
- Feature source imports use configured absolute aliases.
- The dialog store no longer keeps duplicate state and its delayed cleanup
  cannot clear a newly opened dialog.

## Validation plan

- [x] `pnpm --filter iap-admin typecheck`
- [x] `pnpm --filter iap-admin lint`
- [x] `pnpm --filter iap-admin test` (30 tests)
- [x] `pnpm --filter iap-admin build`
- [x] `git diff --check`
