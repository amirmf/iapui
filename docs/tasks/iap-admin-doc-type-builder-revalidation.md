# IAP Admin Form.io builder revalidation

## Scope

- Target: `apps/iap-admin/src/app/router/routes/formio/doc-types/$docTypeId/builder.tsx`
- Reference: `insurance-ui/src/routes/formio/doc-types/$docTypeId/builder.tsx`
- Direct closure: both `DocTypeFormBuilderFrame` implementations and their standalone layouts.

## Inventory

| Capability | Target path | Result |
| --- | --- | --- |
| Public Form.io route | `app/router/routes/formio/doc-types/$docTypeId/builder.tsx` | Present |
| Builder frame | `features/formio/pages/doc-type-form-builder-frame.tsx` | Present |
| Standalone layout | `features/formio/components/formio-standalone-layout.tsx` | Present |
| Schema parser | `features/formio/model/doc-type-form-schema.ts` | Present |
| API schema/service | `@iap/api-types`, `@modules/doc-types` | Present |
| Enum translation constant | Not used by the page closure | Not needed |

## Tasks

| ID | Priority | Task | Status |
| --- | --- | --- | --- |
| RFB-01 | P0 | Compare route, layout, builder options, loading state, reset/save flow, cache invalidation, and iframe integration with the reference. | Complete |
| RFB-02 | P0 | Verify the target API schemas/service preserve the reference GET/PATCH contract and `dataJsonSchema` persistence. | Complete |
| RFB-03 | P1 | Verify locale values and evaluate the enum-translation-constant convention against the mounted closure. | Complete |
| RFB-04 | P0 | Run focused tests, admin checks, and diff hygiene; record evidence. | Complete |

## Completion criteria

- Form.io builder behavior and visible controls match the reference, subject only to documented target architecture equivalents.
- No missing component is introduced when the required target component already exists.
- No enum constant is added without an enum-backed value in the mounted closure.
- Validation commands complete without introduced failures.

## Findings

- Target route, frame, layout, Form.io Bootstrap options, loading state, reset/save controls, schema cloning/parsing, and `['doc-types', ...]` cache invalidation match the reference behavior.
- Target uses public aliases and extracts the parser into `model/`; these are required architecture equivalents. `aria-busy` is retained as a non-visual accessibility improvement.
- `updateSchema` validates and sends `PATCH /doc-types/:id` with `{ id, dataJsonSchema }`; the response is validated through `adminDocTypeSchema`.
- Required Persian values match the reference. The mounted closure displays no enum value, so an enum-to-translation-key constant would be unused duplication.

## Verification

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test`: 37 files, 85 tests passed.
- `pnpm --filter iap-admin lint`: passed.
- `pnpm --filter iap-admin typecheck`: passed.
- `pnpm build:admin`: passed; existing Rollup/Zod annotation and Form.io bundle-size warnings only.
- `pnpm audit --prod --audit-level=high`: no known vulnerabilities.
- Scope review found no new injection, XSS, unsafe URL, authorization, or secret exposure path. `window.open` uses the internally constructed iframe URL and `noopener,noreferrer`.
- `git diff --check`: passed.
