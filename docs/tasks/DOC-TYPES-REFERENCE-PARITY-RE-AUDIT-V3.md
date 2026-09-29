# Doc Types reference-parity re-audit v3

## Status and source of truth

This document supersedes every completion claim in the earlier Doc Types parity
backlogs. Its checklist is based on a fresh direct comparison of the reference
implementation and the target implementation. A task may be marked complete
only after its implementation and the stated verification succeed.

Reference source of truth:

- `insurance-ui/src/features/doc-types/`
- `insurance-ui/src/routes/_authenticated/doc-types/`
- `insurance-ui/src/locales/fa.json`

Target scope:

- `apps/iap-admin/src/features/doc-types/`
- `apps/iap-admin/src/modules/doc-types/`
- `packages/api-types/src/doc-type/`
- `apps/iap-admin/src/app/router/routes/_authenticated/doc-types/`
- `apps/iap-admin/src/shared/i18n/locales/fa/common.json`

## Verified parity repairs

- [x] **P0 — Preserve the reference PATCH body identity contract.** The
  reference `update` and `updateInline` operations send `{ ...data, id }` to
  `PATCH /doc-types/:id`. The target validates and sends only form data. Update
  the endpoint schemas, module service, and service tests so both operations
  validate and transmit the path identifier in the body exactly as the
  reference does.

- [x] **P0 — Remove the unsafe inline-form resolver cast.**
  `DocTypeInlineEditRow` casts `zodResolver` to `Resolver`, masking the
  schema's transformed input/output types. Use `z.input` for the form input
  type and the schema output type for mutation data, keeping the reference
  defaults, numeric-empty handling, and success behavior intact.

- [x] **P1 — Restore the observable create/edit form layout contract.** The
  target's numeric field order differs from the reference, the JSON-schema
  textarea is missing the reference `{"key": "value"}` placeholder, and its
  action row omits reference top spacing. Make these visible details match
  while retaining the target's shared `@iap/forms` bindings and typed resolver.

- [x] **P1 — Restore the edit-error state and reference translation key.**
  The target replaces the reference error panel (message plus outline back
  button) with a bare button and uses `common.back`; the reference uses
  `common.goBack`. Copy the exact Persian `common.goBack` value from the
  reference and implement the matching error branch without suppressing a
  failed detail query.

- [x] **P1 — Match the sample-submission header alignment.** The shared target
  embedded-page component applies `sm:items-center` to both embedded pages,
  while the reference uses it only for the form-builder page. Preserve the
  shared target component but make its layout variant match each reference
  page.

## Intentional architecture adaptations, verified as non-defects

- Routes are thin and use target file-route conventions. Static segments have
  directories; dynamic document-type identifiers remain route input rather
  than feature directories, as required by the architecture document.
- The target uses the authenticated app shell as the `Main` equivalent, and
  target shared tables/forms/dialogs instead of copying reference internals.
  These substitutions preserve the page's visible content and accessibility.
- Feature-local dialog/selection state belongs in the target Zustand store,
  rather than the reference React context. It contains no server state.
- API contracts remain Zod v4 with `.loose()` and common page schema factories,
  as required by target architecture; these are the compliant equivalents of
  reference `.passthrough()` and hand-authored page metadata.
- The target's detail query key uses the consistent hierarchical
  `['doc-types', 'detail', id]` form for edit and embedded pages. This is a
  cache-key adaptation, not a visible or transport-contract difference.
- The target semantic `dir='ltr'` JSON block replaces the reference-specific
  `dir-ltr` utility while keeping the same readable, bounded JSON rendering.
- `min-h-150` is the shared Tailwind token for `37.5rem` (600px), equal to the
  reference iframe minimum height.
- No Doc Type enum-to-translation constant exists in the reference or target;
  adding one would invent a capability and is therefore out of scope.

## Architecture audit and remediation

- [x] **A1 — Audit `/doc-types` against the application architecture and all
  relevant project skills, then remediate confirmed defects.** Verify route
  thinness, feature/module/public-import ownership, Zod API boundaries,
  TanStack Query keys and mutation refreshes, scoped Zustand UI state, shared
  Radix dropdown accessibility, translated/form field behavior, UI responsive
  table handling, and avoidable rendering/type-safety issues. Record only
  evidence-backed repairs in this document.

## Verification record

Commands and outcomes are appended only after the associated tasks are
implemented and pass. Earlier documents' command results do not satisfy this
v3 audit.

- `pnpm --filter iap-admin test` — passed: 19 files, 40 tests.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `pnpm --filter @iap/ui test` — passed: 12 files, 37 tests, including Radix
  dropdown keyboard/accessibility coverage.
- `pnpm --filter @iap/ui typecheck` — passed.
- `pnpm --filter @iap/api-types typecheck` — passed.
- `pnpm --filter iap-admin exec vite build` — passed; only existing third-party
  Zod annotation and bundle-size warnings were reported.
- Direct JSON comparisons verified that the complete `docTypes` locale object
  and `common.notAvailable`, `common.openMenu`, `common.openInNewTab`, and
  `common.goBack` exactly equal the reference values.
- `git diff --check` — passed.

## Architecture-audit outcome

The audited route entries remain thin; the feature owns page behavior and
feature-local UI state, while the module owns validated transport behavior.
No server data is stored in Zustand. Query keys are hierarchical and include
all page dependencies. The Radix menu has an accessible name and keyboard test;
the shared table owns its responsive overflow behavior. The audit removed the
unsafe resolver cast and row-action route casts, and converted Doc Type
components that inspect props to the project body-destructuring convention.

The Doc Type contract also owns reusable `docTypeCodeSchema` and
`docTypeCodesSchema`. Dashboard, Claim Request, Auth, and User Account now
reuse those canonical schemas; no finite Doc Type enum was introduced because
the reference API defines document-type codes as unconstrained strings.
