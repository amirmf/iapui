# ClaimRequestsPage reference-parity tasks

## Scope and evidence

This is the second, file-by-file comparison made on 2026-09-28. The reference
is `/home/sadegh/Android/project/insurance-ui`; the target is `apps/iap-admin`
in this worktree. Every task below names the source evidence; none is inferred.

Page entry points:

- Reference: `src/features/claim-requests/pages/claim-requests-page.tsx`
- Target: `apps/iap-admin/src/features/claim-requests/ui/claim-requests-page.tsx`

Both branches rendered by `ClaimRequestsPage` are in scope: the claim-request
list and the `features=tickets` experience.

## Baseline findings

- The target has the reference `page-lite` path, pagination parameters,
  five-second query settings, quick-status set, and list action endpoints.
- Same-responsibility files still differ. Endpoint-name equality is not proof
  of equivalent state, payload, UI, or translations.
- The current target tickets feature is a partial substitute. It does not
  include the reference provider/store, row actions, detail sheet,
  communication UI, status-history dialog, or complete ticket contract.

## Tasks

### CRP-001 — Rebuild the tickets branch from the reference component graph

**Evidence:** `claim-requests/components/claim-requests-tickets-page.tsx`,
`tickets/components/tickets-content.tsx`, `tickets-data-table-toolbar.tsx`,
`ticket-status-filter.tsx`, `ticket-columns.tsx`, `ticket-row-actions.tsx`,
`ticket-detail-sheet/**`, `tickets/context/ticket-context.tsx`,
`tickets/data/ticket-schema.ts`, and `tickets/services/ticket-service.ts`.

**Discrepancy:** `apps/iap-admin/src/features/tickets/` renders only a custom
list/toolbar. Its row click navigates to a claim request; the reference opens a
ticket detail sheet. All interaction and detail subcomponents above are absent.

**Work:** Port the complete claim-request-context ticket experience, including
its API schemas/service, provider, filters, columns, row actions, detail
sheet, messages, and status history. Keep state feature-local and expose only
public APIs.

**Done when:** `features=tickets` has the same data, filters, actions, detail
interaction, and status switch-back behaviour as the reference.

### CRP-002 — Match main-page composition and URL/table-state behaviour

**Evidence:** reference `claim-requests-page.tsx`,
`use-sync-query-params-table-filter.ts`, and `use-claim-request-ids.ts`.

**Discrepancy:** the target reimplements URL parsing/navigation in
`use-claim-request-table-search.ts` and does not set the reference page's
loaded claim-request IDs. It also does not use the reference `Main`
composition boundary.

**Work:** Add focused URL-state tests, compare search-to-filter/pagination/sort
behaviour, and match the reference. Port the ID side effect only with its real
consumer; otherwise document why that consumer is absent.

**Done when:** identical URL inputs produce identical API filters, page, sort,
selection reset, and action IDs.

### CRP-003 — Align every mounted list component

**Evidence:** `claim-request-data-table-toolbar.tsx`,
`claim-request-status-filter.tsx`, `claim-request-header-actions/**`,
`claim-request-fetch-new-empty-state.tsx`, `claim-request-columns.tsx`,
`claim-request-row-actions.tsx`, `claim-request-row-actions/**`,
`claim-request-bulk-*.tsx`, `claim-request-generate-and-send-bulk-dialog.tsx`,
and `claim-request-delete-dialog.tsx`.

**Discrepancy:** target counterparts differ in component composition, props,
shared primitives, column rendering, and action orchestration. In particular,
the target combines the reference's row-action dialogs and uses custom ticket
toolbar logic.

**Work:** Compare each component's rendered state, permission, mutation
payload, success/error handling, disabled state, navigation, and translations.
Split target components only where that improves ownership/readability.

**Done when:** every visible list, filter, header, row, empty, and dialog state
has the reference behaviour and Persian copy.

### CRP-004 — Port exact claim-request API schemas and services

**Evidence:** `claim-request-schema.ts`, `core-ai-schema.ts`,
`claim-request-service.ts`, and `core-ai-service.ts` in the reference feature.

**Discrepancy:** the expanded target claim-request schema still contains
`z.unknown()` for several nested reference types; it is therefore not exact.
The target also merged the reference Core AI service into the claim-request
service, so each operation still needs a field-by-field comparison.

**Work:** Translate the referenced Zod schemas field-for-field into
`@iap/api-types`, including nested objects, enums, pages, and every
request/response mounted by this page and its ticket branch. Preserve exact
field names, optionality, defaults, endpoint paths, and query/body placement;
retain strict request objects required by this workspace.

**Done when:** schema fixtures and service tests verify exact valid/invalid
shape, method, URL, and validated request placement for every mounted action.

### CRP-005 — Synchronize verified page-surface translations

**Evidence:** reference `src/locales/fa.json` and the complete component
closure named in CRP-001 and CRP-003.

**Discrepancy:** the target namespaces are partial. Prior synchronization used
a manually selected subset, which cannot prove equality; required ticket-detail
keys are missing.

**Work:** Extract static keys, expand dynamic enum keys, and copy only the
corresponding Persian values verbatim from the reference. Do not introduce
unrelated claim-management keys.

**Done when:** automated key/value comparison reports no missing or different
page-surface key.

### CRP-006 — Restore target architecture and remove temporary UI

**Evidence:** `APPLICATION-ARCHITECTURE.md` dependency rules and target
`features/tickets/ui/claim-request-tickets-page.tsx`.

**Discrepancy:** the temporary tickets feature imports claim-request internals,
breaking target feature-boundary rules. The obsolete tickets placeholder also
remains in source after routing changed.

**Work:** Put shared claim-context ticket capability behind a public feature or
focused module boundary, remove superseded temporary files, and leave routes
as thin public composition.

**Done when:** no feature reaches another feature's internals and no unused
placeholder remains.

### CRP-007 — Verify completed parity work

**Work:** Add focused behaviour, API-contract, schema, and translation tests.
Run typecheck, lint, tests, and a local code review. Verify table overflow,
keyboard operation, `aria-pressed` quick-status controls, pending buttons, and
loading/error/empty states in both branches.

**Done when:** all checks pass with no unresolved correctness, performance,
maintainability, or accessibility finding.

## Execution order

1. CRP-004 and CRP-005 establish exact contracts and copy.
2. CRP-001 implements the complete tickets branch.
3. CRP-002 and CRP-003 align list behaviour.
4. CRP-006 removes the temporary implementation and repairs boundaries.
5. CRP-007 verifies the completed work.

## Component audit matrix

The following direct dependency closure was compared file by file. This matrix
is deliberately scoped to `ClaimRequestsPage`; claim-request-management-only
components are not mounted by this page and are therefore excluded.

| Reference component | Target before execution | Required task |
| --- | --- | --- |
| `claim-requests-page.tsx` | Equivalent page branch but different URL-state composition | CRP-002 |
| `claim-requests-tickets-page.tsx` | Custom list without `TicketProvider` | CRP-001, CRP-006 |
| `tickets-content.tsx` | Custom `ClaimRequestTicketsPage` | CRP-001 |
| `tickets-data-table-toolbar.tsx` | `ticket-toolbar.tsx` with a different status set and no cached counts | CRP-001 |
| `ticket-status-filter.tsx` | Inline seven-status filter, including excluded reference statuses | CRP-001 |
| `ticket-columns.tsx` | Different click behaviour, no action column, uncoloured badges | CRP-001 |
| `ticket-row-actions.tsx` | Missing | CRP-001 |
| `ticket-context.tsx` | Missing | CRP-001 |
| `ticket-detail-sheet/index.tsx` | Missing | CRP-001 |
| `ticket-communication-column.tsx` | Missing | CRP-001 |
| `ticket-detail-sheet-actions.tsx` | Missing | CRP-001 |
| `ticket-detail-sheet-header.tsx` | Missing | CRP-001 |
| `ticket-message-list.tsx` / `ticket-message.tsx` | Missing | CRP-001 |
| `ticket-readonly-detail.tsx` | Missing | CRP-001 |
| `ticket-related-claim-request-column.tsx` | Missing | CRP-001 |
| `ticket-status-history-dialog.tsx` | Missing | CRP-001 |
| `ticket-schema.ts` | Partial schema expansion without an equivalence test | CRP-004 |
| `ticket-service.ts` | Same endpoint names, but no parity coverage for defaults and request placement | CRP-004 |

### Final execution status

- CRP-001 is complete: the ticket branch now has its reference-aligned
  provider/store, filters, row actions, focused detail components, messages,
  status history, presentation mappings, and related assessment-items view.
- CRP-002 is complete: Claim Request and ticket URL/table-state behaviour is
  covered by focused fixtures and component tests; the reference loaded-ID
  store has no target consumer and was correctly not introduced as dead state.
- CRP-003, CRP-004, and CRP-005 are complete: mounted list behaviour, API
  contracts, schemas, and page-surface Persian translations were compared
  against the reference and are covered by regression tests.
- CRP-006 and CRP-007 are complete: the temporary UI was removed, feature
  boundaries were restored, and typecheck, lint, focused accessibility checks,
  and the complete test suite passed.

## Completed implementation checklist

- [x] **CRP-001.1** Split the current ticket detail implementation into the
  reference-aligned focused UI components and include the missing assignment
  action, coloured status/category/priority presentation, and assessment-items
  section. Verified: detail header, actions, communication, readonly metadata,
  related claim request, and status-history UI are independently owned;
  reference status/category/priority mappings and colours are shared by the
  table and detail; and the reference assessment-items endpoint, schema,
  read-only query, cards, and Persian copy are mounted in the related-claim
  column. `assignToLatestAssessmentUser` deliberately remains service-only:
  the reference has no UI call-site for it.
- [x] **CRP-001.2** Compare the tickets route search, status-filter reset, and
  quick-status switch-back behaviour against the reference at component-test
  level. Verified with RTL coverage in
  `claim-request-tickets-page.test.tsx` and `ticket-status-filter.test.tsx`:
  ticket status changes reset only the page while preserving ticket filters,
  and switching away from the ticket quick status restores the reference
  Claim Request search state without ticket-only filters.
- [x] **CRP-002.1** Add URL-state fixtures for pagination, sorting, quick
  status, doctor defaults, and selection reset; record whether the reference
  ID store has a target consumer before porting it. Investigation note:
  `useClaimRequestIds` has no target consumer; target bulk/header actions use
  the selected row IDs derived in `ClaimRequestsPage`, so porting a loaded-row
  ID store would add unused feature state and is intentionally excluded.
  Verified with six feature-local fixtures for round trips, malformed defaults,
  doctor normalization, feature filtering, and selection reset; the page and
  store now use the tested table-state model.
- [x] **CRP-003.1** Audit and align each claim-request toolbar, column,
  header-action, row-action, bulk-dialog, empty-state, and delete-dialog
  mounted behaviour, including permissions and pending state. Verified
  file-by-file against the reference: the toolbar includes the two
  registered-by-agent filters with their reference query modes, columns use
  the reference document-type fallbacks and badge states, and mutation success
  flows await the page refetch. Shared IAP dialogs preserve the equivalent
  destructive, pending, permission, payload, navigation, and Persian-copy
  behaviour required by the target architecture.
- [x] **CRP-004.1** Add schema fixtures for nested Claim Request and Ticket
  values, including their invalid enum/type cases. Verified by
  `claim-request-contract.test.ts`: it covers nested AI assessment, duplicate,
  objection, insured-person, assignment, status-history, ticket assignment,
  and ticket status-history values, plus invalid enum/type rejection.
- [x] **CRP-004.2** Add service tests for every claim-request operation mounted
  by this page, proving endpoint, HTTP method, body/query placement, defaults,
  cancellation, and response validation. Verified by
  `claim-request-service.test.ts`, which exercises page, detail, assignment,
  bulk delete/status/core-AI, new assignment, deletion, export, Fanavaran,
  notification, and document-type operations with transport assertions and
  invalid-input checks.
- [x] **CRP-005.1** Perform the corresponding key/value comparison for the
  claim-request page-surface namespace after CRP-003 fixes its closure.
  Verified after the final CRP-003 component closure with
  `claim-request-translations.test.ts`, which compares every static and dynamic
  mounted Claim Request translation key/value against the reference, including
  the registered-by-agent toolbar filters.
- [x] **CRP-006.1** Remove the obsolete tickets placeholder and eliminate any
  cross-feature internal import through a deliberate public API or module.
  Verified: the placeholder no longer exists; `features/tickets` imports the
  Claim Request capability only through `@features/claim-requests`; typecheck,
  lint, tests, and import-boundary scans pass.
- [x] **CRP-007.1** Run focused component/accessibility checks for table
  overflow, keyboard operation, pressed states, pending actions, and
  loading/error/empty states; complete a local code review. Verified with
  RTL loading/empty-state coverage, native button and `aria-pressed` review,
  responsive filter grid and table-overflow checks, status/alert live-state
  semantics, pending-action guards, `typecheck`, lint, and the complete test
  suite. No browser E2E viewport runner is configured; this does not leave a
  static-code or test finding unresolved.
