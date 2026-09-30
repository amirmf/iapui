# IAP Admin — Document type edit page parity

## Scope

Implement and verify `/doc-types/$docTypeId/edit` in `iap-admin` against the
reference page at
`insurance-ui/src/routes/_authenticated/doc-types/$docTypeId/edit.tsx` and its
mounted closure. The reference is the source of truth for observable UI,
navigation, API method/path/payload, schema behavior, and Persian translations.

## Source-backed closure

| Responsibility | Reference | IAP Admin owner |
| --- | --- | --- |
| Route | `src/routes/_authenticated/doc-types/$docTypeId/edit.tsx` | `apps/iap-admin/src/app/router/routes/_authenticated/doc-types/$docTypeId.edit.tsx` |
| Page | `src/features/doc-types/pages/doc-type-edit-page.tsx` | `apps/iap-admin/src/features/doc-types/pages/edit/doc-type-edit-page.tsx` |
| Form | `src/features/doc-types/components/doc-type-form.tsx` | `apps/iap-admin/src/features/doc-types/ui/doc-type-form/doc-type-form.tsx` |
| API and schemas | `src/features/doc-types/services/doc-type-service.ts`, `src/features/doc-types/data/doc-type-schema.ts` | `apps/iap-admin/src/modules/doc-types/services/doc-type-service.ts`, `packages/api-types/src/doc-type/index.ts` |
| Translations | `src/locales/fa.json` (`docTypes`) | `apps/iap-admin/src/shared/i18n/locales/fa/common.json` (`docTypes`) |

## Component availability

All required reference capabilities already have an architecture-compliant target
equivalent: thin route, edit page, shared page layout, document-type form,
TanStack Query service, Zod contracts, and shared form fields. No component is
missing; no new component must be introduced.

The target has no document-type enum rendered by this page. Existing feature
constants are used for enum option presentation in other domains, so adding a
document-type constant here would be unused and would not improve consistency.

## Tasks

| ID | Task | Priority | Status |
| --- | --- | --- | --- |
| 1 | Verify route parameters, breadcrumb loader, and row-action URL against the reference. | P0 | Completed — paths and parameters match the target route convention. |
| 2 | Align edit-page loading, missing/error, and exit behavior with the reference while preserving the target feature/module boundaries. | P0 | Completed — uses the reference query key, enabled guard, branches, and exit navigation. |
| 3 | Verify the shared form’s fields, defaults, validation, mutation request, invalidation, success navigation, and pending controls against the reference. | P0 | Completed — all reference fields/defaults, PATCH payload behavior, list invalidation, toast, navigation, and disabled pending actions are present. |
| 4 | Verify API contracts and exact Persian `docTypes` translation values; assess whether enum constants apply. | P0 | Completed — contracts/endpoint match and locale values are identical; no enum is rendered. |
| 5 | Add or update focused tests for the page’s visible loading, missing/error, and edit-form behavior. | P1 | Completed — `doc-type-edit-page.test.tsx` covers all three mounted branches. |
| 6 | Run focused tests, admin typecheck/lint, and `git diff --check`; update this document with evidence. | P0 | Completed — verified 2026-09-30. |

## Completion criteria

- The route renders the edit feature and preserves its breadcrumb.
- The page loads the document type by id, renders the reference-equivalent
  heading/description/form, and provides the same recoverable missing/error
  state and return navigation.
- The shared form preserves the reference field set and PATCH request contract.
- Tests cover observable page branches; static checks pass.

## Verification evidence

- `pnpm --dir apps/iap-admin exec vitest run src/features/doc-types/pages/edit/doc-type-edit-page.test.tsx` — 3 passed.
- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test` — 76 passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
