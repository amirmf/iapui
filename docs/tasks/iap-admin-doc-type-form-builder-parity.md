# iap-admin document type form builder parity

## Scope

- Target URL: `/doc-types/$docTypeId/form-builder`
- Reference entry point: `insurance-ui/src/routes/_authenticated/doc-types/$docTypeId/form-builder.tsx`
- Reference page: `insurance-ui/src/features/doc-types/pages/doc-type-form-builder-page.tsx`
- Reference embedded builder: `insurance-ui/src/features/formio/pages/doc-type-form-builder-frame.tsx`

The reference implementation is the source of truth for visible behaviour, API
contract use, schema persistence, and Persian translations. Target route files
remain composition-only under the iap-ui architecture.

## Verified baseline

- The target route and its outer embedded page already exist.
- The target API contract and service already expose `updateSchema(id, schema)`
  and validate the PATCH request and response through `@iap/api-types`.
- The target did not have the Form.io builder route, standalone layout, or
  builder frame. The required Form.io/Bootstrap packages have now been added.
- The required builder translation keys already existed in the target with the
  exact reference Persian values, so no locale file was changed.
- No document-type enum translation constant is present in the reference page
  closure or required for this screen. Existing target constants are therefore
  not duplicated or introduced speculatively.

## Missing component inventory

| Component or capability | Reference source | Target owner |
| --- | --- | --- |
| Standalone Form.io frame layout | `features/formio/components/formio-standalone-layout.tsx` | `features/formio/components/` |
| Document-type Form.io builder frame | `features/formio/pages/doc-type-form-builder-frame.tsx` | `features/formio/pages/` |
| Public Form.io builder route | `routes/formio/doc-types/$docTypeId/builder.tsx` | `app/router/routes/formio/doc-types/` |

## Tasks

| ID | Priority | Task | Status | Completion evidence |
| --- | --- | --- | --- | --- |
| DT-FB-01 | P0 | Verify the direct reference closure, current target route, API service/schema, translations, and constants. | Complete | This document records the verified sources and baseline. |
| DT-FB-02 | P0 | Add the minimal Form.io and Bootstrap runtime dependencies needed by the reference builder. | Complete | `iap-admin` declares `@formio/js`, `@formio/react`, and `bootstrap`; the lockfile resolves them. |
| DT-FB-03 | P0 | Port the standalone Form.io layout and builder frame into the target `features/formio` owner, preserving reset, save, loading, schema parsing, cache invalidation, and accessible controls. | Complete | Frame, layout, and schema-parser test are present; save uses the existing validated service. |
| DT-FB-04 | P0 | Add the thin public Form.io builder route and regenerate the route tree. | Complete | `routeTree.gen.ts` contains `/formio/doc-types/$docTypeId/builder`; typecheck passes. |
| DT-FB-05 | P1 | Extract only the required reference Persian translation keys; confirm that no page-scope enum-translation constant is needed. | Complete | `common` and `docTypes` keys match the reference values; the reference closure has no enum translation constant. |
| DT-FB-06 | P1 | Reconcile the existing outer page with the reference without duplicating its reusable target embedded-page capability. | Complete | Existing `DocTypeEmbeddedPage` already matches the reference header, iframe source, back navigation, and external-open behaviour while also serving the sibling submission page. |
| DT-FB-07 | P0 | Run focused tests, lint, typecheck, and `git diff --check`; update this document with results. | Complete | Complete suite, lint, typecheck, build, and diff hygiene checks passed. |

## Completion log

- Focused tests (schema parser, document-type contract, and service): passed.
- `iap-admin` typecheck: passed.
- `iap-admin` lint: passed.
- `iap-admin` complete test suite: 33 files and 75 tests passed with
  `INSURANCE_UI_REFERENCE_PATH` set to the local reference checkout.
- Vite production build: passed. It reported existing tenant-metadata placeholder
  warnings and Form.io's expected large lazy builder chunk warning.
- `git diff --check`: passed.
