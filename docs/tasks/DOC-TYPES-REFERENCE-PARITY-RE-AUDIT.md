# Doc Types reference parity re-audit

## Evidence and scope

Reference: `insurance-ui/src/features/doc-types/` and
`insurance-ui/src/routes/_authenticated/doc-types/`.

Target: `iap-admin`'s `features/doc-types`, `modules/doc-types`,
`packages/api-types/src/doc-type`, and authenticated route tree.

The target Persian `docTypes` locale object is byte-for-value equal to the
reference object. The target document-type module covers every reference API
endpoint and validates both request and response boundaries. Its different
imports and Zod v4 `.loose()` use are required target-architecture adaptations,
not parity defects.

## Parity tasks

- [x] **P0 — Restore all reference navigation flows.** Add the create, edit,
  Form.io builder, and sample-submission feature pages and their authenticated
  routes. Restore the header create button and the edit/builder/submission row
  actions. The prior implementation omitted them, producing an incomplete page.
- [x] **P0 — Add the reference `DocTypeForm`.** Use the exact reference fields,
  defaults, mutation operations, and translated messages; keep its code in the
  target feature and consume the existing document-type module public API.
- [x] **P0 — Match `DocTypesPage` query/table behavior.** Restore manual
  sorting, controlled sorting URL state, `gcTime: 30_000`, the reference Main
  page boundary (or target-equivalent shell), `common.notAvailable` cell
  fallback, and the target shared long-text behavior.
- [x] **P1 — Match the reference row-action contract.** Replace the compact
  three-button action group with the reference action menu containing details,
  form builder, sample submission, inline edit, full edit, and delete. Preserve
  its unavailable-ID guards and accessible label.
- [x] **P1 — Match dialogs and inline-edit lifecycle.** Restore the selected
  document-type context in the delete confirmation, delayed current-row cleanup
  after dialog close, full details formatting, and reference refresh/error
  behavior while using target shared primitives.
- [x] **P1 — Add reference schema tests.** Port the reference document-type
  schema assertions to the target API-contract package and verify all request /
  response schemas against the same fixture fields.

## Architecture remediation task

- [x] **A1 — Audit and remediate `/doc-types` architecture.** Apply the
  architecture document and relevant project skills to the completed page:
  route files remain thin; screen behavior lives in `features`; reusable
  document-type operations stay in the module public API; server state stays in
  TanStack Query; local UI state stays in `model/store`; shared forms/tables/UI
  are reused; URL query parameters are validated; all page request/response
  contracts use the mandated common Zod page factories; classes use `cn`; and
  tests cover local state, contracts, routes, and visible page behavior.

  Verified: the route remains a thin composition boundary; screen UI and local
  Zustand state live in `features/doc-types`; backend operations remain behind
  the `modules/doc-types` public API; the page's request/response schemas use
  the common page factories; URL search is validated; all feature imports use
  configured absolute aliases; and focused contract, route-search, state, and
  visible DropdownMenu interaction tests pass.

## Intentional target adaptations

- A feature-local Zustand store replaces the reference React context because
  target architecture explicitly assigns feature UI state shared by independent
  components to `model/store`.
- `@modules/doc-types` owns transport behavior; the feature must not duplicate
  the service.
- Zod v4 `.loose()` replaces the reference's deprecated `.passthrough()`.
- The target's shared table, form, dialog, and UI public APIs replace reference
  internals only where their visual and behavioral contract remains equivalent.
