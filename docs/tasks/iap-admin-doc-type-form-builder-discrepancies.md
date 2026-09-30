# DocTypeFormBuilderPage reference parity audit

## Scope and source of truth

- Reference route: `insurance-ui/src/routes/_authenticated/doc-types/$docTypeId/form-builder.tsx`
- Reference page: `insurance-ui/src/features/doc-types/pages/doc-type-form-builder-page.tsx`
- Reference frame: `insurance-ui/src/features/formio/pages/doc-type-form-builder-frame.tsx`
- Reference layout: `insurance-ui/src/features/formio/components/formio-standalone-layout.tsx`
- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/doc-types/$docTypeId.form-builder.tsx`
- Target page: `apps/iap-admin/src/features/doc-types/pages/form-builder/doc-type-form-builder-page.tsx`
- Target frame: `apps/iap-admin/src/features/formio/pages/doc-type-form-builder-frame.tsx`

The comparison covers the complete mounted builder closure only. The target keeps
route files thin and preserves the iap-ui Zod v4 API-contract boundary.

## Verified matches

| Area | Verified reference behaviour | Target result |
| --- | --- | --- |
| Outer route | `/doc-types/$docTypeId/form-builder` mounts the builder page. | Match. |
| Frame route | `/formio/doc-types/$docTypeId/builder` mounts the builder iframe. | Match. |
| Read API | `GET /doc-types/:id`, query key `['doc-types', 'detail', docTypeId]`. | Match. |
| Save API | `PATCH /doc-types/:id` with `{ id, dataJsonSchema }`. | Match; target adds required Zod v4 request/response validation. |
| Schema persistence | Empty fallback, JSON parse guard, cloned Form.io value, reset, save, success state, and `doc-types` cache invalidation. | Match. |
| Form.io options | Bootstrap template, empty builder config, no submit/source, English language, empty i18n. | Match. |
| Locale keys and Persian values | `common.back`, `common.openInNewTab`, `common.loading`, `common.reset`, and the three `docTypes` keys. | Exact match. |
| Enum translation constant | None used by the reference closure. | None required in target. |

## Discrepancies and tasks

| ID | Priority | Discrepancy | Required change | Status |
| --- | --- | --- | --- | --- |
| FB-PAR-01 | P0 | Target `DocTypeFormBuilderPage` delegated to the cross-page `DocTypeEmbeddedPage`; the reference owns its exact builder header and iframe markup. | Replaced it with a dedicated implementation matching the reference structure. The shared helper remains only for the sibling submission example. | Complete |
| FB-PAR-02 | P0 | Target used Lucide `ArrowLeft`/`ExternalLink`; reference uses Tabler `IconArrowLeft`/`IconExternalLink`. | Added the reference `@tabler/icons-react` manifest range and use its reference icons and 16px sizing in the outer page. | Complete |
| FB-PAR-03 | P0 | The target builder frame used Lucide `RotateCcw`/`Save`; reference uses Tabler `IconRotate`/`IconDeviceFloppy`. | Uses the reference icons and 16px sizing in the reset and save controls. | Complete |
| FB-PAR-04 | P1 | Target frame adds `aria-busy` and uses different local naming/lazy state initialization. These do not alter visible behaviour or API requests. | Retain target accessibility and performance-safe implementation; no source-backed behaviour change is needed. | Accepted architectural variation |
| FB-PAR-05 | P1 | Target does not wrap the page in reference `Main`; target `AuthenticatedLayout` already owns the equivalent authenticated content boundary. | Retain target app-shell ownership to avoid a nested/duplicated page shell. | Accepted architectural variation |
| FB-PAR-06 | P1 | Target navigation uses `/doc-types/` rather than reference `/doc-types`, and uses its configured Tailwind `min-h-150` token rather than literal `min-h-[600px]`. | Use the target route literal and token because they resolve to the same target route and 600px minimum height; do not introduce an incompatible route path or duplicate arbitrary style. | Accepted architectural variation |
| FB-PAR-07 | P0 | The current test only covered schema parsing; it did not protect the outer page’s reference heading, iframe source, and external-open behaviour. | Added a focused page test for the exact builder surface and URL state. | Complete |
| FB-PAR-08 | P0 | The target dependency range for `@formio/js` was resolved from a newer source range than the reference manifest. | Aligned its manifest range with reference `^5.5.2` while retaining the lockfile’s compatible resolution. | Complete |

## Completion criteria

1. The target’s builder page has the same mounted DOM hierarchy, icon family,
   translations, query, iframe URL, height, and actions as the reference.
2. The iframe builder has the same Form.io configuration, persistence workflow,
   controls, and visual icons as the reference.
3. The existing target API and Zod v4 schemas retain the reference endpoint,
   method, payload fields, optionality, and response fields.
4. Focused page and schema tests, full iap-admin tests, lint, typecheck, and
   `git diff --check` pass.

## Verification

- Focused page test verifies the reference heading, document-type label, iframe
  source, back navigation, and external-open window arguments.
- Full iap-admin test suite: 34 test files and 76 tests passed with
  `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`.
- `iap-admin` lint, typecheck, and `git diff --check` passed.
