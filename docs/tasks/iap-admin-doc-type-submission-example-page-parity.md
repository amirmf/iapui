# IAP Admin — Document type sample-submission page parity

## Scope

Implement and verify `/doc-types/$docTypeId/submission-example` in `iap-admin`
against the reference route
`insurance-ui/src/routes/_authenticated/doc-types/$docTypeId/submission-example.tsx`
and its mounted `DocTypeSampleSubmissionPage` closure. The reference is the
source of truth for observable UI, navigation, API usage, iframe URL and
security options, schema behavior, and Persian translations. Target
architecture rules take precedence where ownership differs.

## Source-backed component inventory

| Responsibility | Reference source | Target state | Required target owner |
| --- | --- | --- | --- |
| Thin route | `src/routes/_authenticated/doc-types/$docTypeId/submission-example.tsx` | Present | `app/router/routes/_authenticated/doc-types/$docTypeId.submission-example.tsx` |
| Page composition | `src/features/doc-types/pages/doc-type-sample-submission-page.tsx` | Present through a shared wrapper | `features/doc-types/pages/submission-example/` |
| Document type lookup | `features/doc-types/services/doc-type-service.ts` | Present and contract-validating | `modules/doc-types/services/doc-type-service.ts` |
| Request/response schema | `features/doc-types/data/doc-type-schema.ts` | Present | `@iap/api-types/doc-type` |
| Localized strings | `src/locales/fa.json` | Present; exact values need verification | `shared/i18n/locales/fa/common.json` |
| Embedded Form.io route | `src/routes/formio/doc-types/$docTypeId/submission-example.tsx` | Requires route and renderer-closure verification | `app/router/routes/formio/doc-types/` and its feature owner |

## Component gaps found before implementation

No new visual primitive is missing: `@iap/ui` already provides the button used
by the reference, and Lucide provides the needed directional and external-link
icons. The existing `DocTypeEmbeddedPage` provides most page mechanics, but it
is shared with the form-builder page and must be verified against the
submission-example-specific reference behavior before reuse is accepted.

The Form.io submission-example route/renderer closure is the only capability
not yet confirmed by the initial inventory; it will be either reused if present
or ported minimally from the reference when source-backed and page-scoped.

The page does not render any backend enum. Therefore no enum translation
constant is needed. The existing `special-disease-options` constant is a
typed enum-to-presentation map for a different feature and should remain
separate.

## Tasks

| ID | Task | Priority | Status |
| --- | --- | --- | --- |
| 1 | Trace both route closures, including Form.io renderer, and record concrete parity differences. | P0 | Completed — the target outer page existed, but its iframe destination had no route or renderer. |
| 2 | Verify existing API call, Zod request/response contract, query key, and exact Persian keys/values against the reference. | P0 | Completed — the existing validated document-type module, query key, and all mounted Persian values match the reference. |
| 3 | Align the page composition, back navigation, RTL/LTR icons, new-tab security, iframe identity/title, and responsive height with the reference while keeping routes thin. | P0 | Completed — page-specific composition now matches the reference; the source-backed Form.io renderer and thin standalone route closure are present. |
| 4 | Add focused tests for iframe source, navigation, lookup loading, and new-tab behavior. | P1 | Completed — two focused page tests cover the API query, source URL, navigation, and `noopener,noreferrer` behavior. |
| 5 | Run focused tests, full admin tests, typecheck, lint, and `git diff --check`; record evidence. | P0 | Completed — verified 2026-09-30. |

## Completion criteria

- The authenticated route remains a thin composition boundary.
- The page has the same user-visible behavior as the reference and uses only
  target-owned module, feature, shared, and package public APIs.
- The embedded Form.io sample-submission route resolves for the same document
  type identifier.
- API and locale behavior are copied from verified source, not inferred.
- The task document contains completed verification evidence.

## Verification evidence

- `pnpm --filter iap-admin exec vitest run src/features/doc-types/pages/submission-example/doc-type-sample-submission-page.test.tsx` — 2 passed.
- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test` — 80 passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `pnpm --filter iap-admin exec vite build` — passed. Vite reported pre-existing unset tenant metadata placeholders and its standard large-chunk warning; the Form.io renderer remains isolated to its standalone route chunk.
- `git diff --check` — passed.

## Second line-by-line parity audit (2026-09-30)

This audit traces the complete mounted closure rather than only the outer
authenticated page:

1. authenticated route;
2. `DocTypeSampleSubmissionPage`;
3. standalone Form.io route chain;
4. `DocTypeFormRendererFrame` and `FormioStandaloneLayout`;
5. document-type service and Zod contracts; and
6. every mounted Persian translation key.

| ID | Comparison finding | Classification | Action | Status |
| --- | --- | --- | --- | --- |
| A1 | The reference page uses a default export; the target uses a named export to support its feature public API. | Structural only | Made the page implementation a default export and re-exported it from the target feature public API. | Completed |
| A2 | The reference renderer and standalone layout expose default exports; the target exposes named exports. | Structural only | Restored default implementation exports while retaining the target public feature API. | Completed |
| A3 | The reference wraps the page in `Main`; the target authenticated shell already owns this layout boundary. | Required architecture adaptation | Retain target shell composition; do not introduce a duplicate page shell. | Verified |
| A4 | The reference imports feature internals directly; the target routes import feature public APIs. | Required architecture adaptation | Retain target public API boundary. | Verified |
| A5 | The reference uses Tabler icons; iap-admin's existing icon family is Lucide. Both render the same 16px directional/external-link affordances. | Required design-system adaptation | Retain Lucide. | Verified |
| A6 | `Boolean(docTypeId)` and `!!docTypeId` are behaviorally equivalent. | Structural only | Aligned the source expression style. | Completed |
| A7 | The target uses the router's trailing-slash canonical `/doc-types/`; the reference router canonicalizes `/doc-types`. | Required router adaptation | Retain the target canonical URL. | Verified |
| A8 | The target service validates path/body envelopes through `@iap/api-types`; the reference validates the direct payload. The emitted `PATCH /doc-types/:id` body is identical. | Required architecture adaptation | Retain target Zod boundary validation. | Verified |
| A9 | The target uses Zod v4 `.loose()` while the reference uses deprecated Zod v3 `.passthrough()`. Both preserve unknown response fields. | Required architecture adaptation | Retain the required Zod v4 API. | Verified |
| A10 | The reference has no explicit outer-page loading/error branch; target behavior is identical. | No discrepancy | No change. | Verified |
| A11 | The Form.io renderer has matching schema/submission parsing, query key, mutation endpoint/body, reset/save disable state, toast, cache invalidation, and empty-schema branch. | No discrepancy | No change. | Verified |
| A12 | The standalone Form.io layout has matching rendered markup; only comments/type syntax differ. | No discrepancy | No behavior change; default export restored in A2. | Completed |
| A13 | All mounted Persian values match byte-for-byte: `common.back`, `common.openInNewTab`, `common.reset`, `common.loading`, `submissionTitle`, missing-schema title/description, save label, and success toast. | No discrepancy | No translation change. | Verified |
| A14 | The prior test only covered the outer page; it did not exercise the mounted Form.io renderer’s loading, missing-schema, or save behavior. | Test gap | Added focused renderer tests for loading, missing schema, query identity, changed submission, and save payload. | Completed |

### Second-audit completion criteria

- Default implementation exports match the reference where compatible with the
  target's feature public API.
- The target preserves only the three necessary architectural adaptations:
  authenticated shell ownership, public feature imports, and Zod v4 service
  boundaries.
- Renderer tests demonstrate the source-backed Form.io branches and mutation
  sequence.

Second-audit verification: the two page-specific test files pass 4 tests;
the full admin test suite, typecheck, lint, and `git diff --check` all pass.

## Worktree re-verification (2026-09-30)

The requested implementation was already present on `main` before this task's
dedicated worktree was created. A fresh checkout from `main` confirmed the
complete source-backed closure without requiring a product-code change:

1. The authenticated sample-submission page composes the same iframe URL,
   document-type query, navigation, RTL/LTR affordances, and new-tab security
   arguments as the reference.
2. The standalone `/formio/doc-types/$docTypeId/submission-example` route
   resolves to `DocTypeFormRendererFrame`, whose loading, missing-schema,
   form-change, reset, save, toast, and query-invalidation behavior matches
   the reference.
3. The target retains only the documented architecture adaptations: public
   feature/module imports, the authenticated shell owning the page layout, and
   Zod v4 `.loose()` response validation.
4. No enum is rendered by this page. Consequently, the existing enum-label
   constants remain feature-local and no page-specific constant was added.

Current evidence:

- Focused outer-page and Form.io renderer tests — 4 passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
- The preceding complete verification remains authoritative for the Vite build
  and full test suite; this re-verification repeated the page-scoped checks.

## Reuse assessment

No new skill is needed. The existing `reference-page-parity` skill already
captures the reusable workflow for this and future source-backed page ports:
trace the mounted closure, document source-backed differences, preserve target
architecture boundaries, and verify contracts, translations, and visible
behavior. This task document supplies the document-type/Form.io-specific
inventory that future related pages can reuse.
