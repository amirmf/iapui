> Historical audit. Superseded by [the second audit](../claim-requests-re-audit-v2/README.md). Completion and omitted-store statements below describe the earlier implementation only.

# ClaimRequestsPage reference implementation — 2026-10-07

Target: `iap-admin`. Worktree: `/home/sadegh/.codex/worktrees/claim-requests/iap-ui`, created from `main` before inspection; branch: `codex/claim-requests`. Reference: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/claim-requests/index.tsx` → `features/claim-requests/pages/claim-requests-page.tsx`.

## Scope and accepted interpretation

The user confirmed that components, translations, APIs and schemas must match the reference under the current application's architecture. Preserve the mounted claim list, dialogs and `features=tickets` branch, and existing reference management navigation. Management page implementation is outside this single-page task. The existing management route is a placeholder; it has not been expanded. The source loaded-ID store only serves management navigation and has no target consumer; it is not introduced as unused state.

Ownership follows `APPLICATION-ARCHITECTURE.md`: single root feature page, small components, feature query definitions, feature Router adapters, feature constants, public reusable disease module, and package API contracts. Routes are unchanged. The source `Main` composition uses the already equivalent shared Main. Query/URL behavior and selected-row state are kept separate. No commits, merge or push have been performed.

## Task index

1. [Contracts and constants](01-contracts-and-constants.md): enum order, field-by-field/nested contracts, canonical services and API boundary validation.
2. [Grouped filters](02-grouped-filters.md): source groups, fields, role gates, quick-status controls and URL behavior.
3. [Document receipt](03-document-receipt.md): PDF endpoint, translated form and pending/success/failure flow.
4. [Table and actions](04-table-and-actions.md): disease badges/colors, columns, canonical focused row dialogs and mutation sequencing.
5. [Verification](05-verification.md): source comparison, integration tests and workspace checks.

The prior `../claim-requests-reference-parity.md` is historical. Its completion claims do not establish current-source parity.

## Explicit architecture adaptations

Strict outgoing objects and shared request/response pagination factories remain as required by architecture. Common page metadata is nullish; source metadata is required. Package enums are static reusable Zod contracts; translated schema factories are feature-owned. `.nullish()`/`.loose()` and record values of `z.unknown()` use current Zod APIs with equivalent values. The claim document-type update contract is domain-prefixed to avoid collision with the existing doc-type contract public export. Canonical service names are mounted; existing public aliases preserve consumers. No schema semantics change is applied to unrelated domains.

Source-specific Core AI and Fanavaran error feedback is preserved within this page's existing flow. Excel uses global mutation error handling, as does the reference. Shared grouped-filter changes preserve the accepted main-branch pagination reset behavior. Source date interpretation is scoped to claim/ticket callers and does not change shared defaults.

## Source evidence and verification limits

`reference-schema-parity.test.ts` executes the trusted source schema definitions and compares every base field, nested parsed output and issue paths. Constants and Persian values are compared against source; absent source keys `claimRequests.actions.view` and `claimRequests.messages.docTypeUpdateFailed` deliberately show literal fallback keys. Disease, row styling, receipt form, dialogs, filters, requests, ticket branch and shared row forwarding have focused regression coverage.

Recovery focused run passed 22 files / 66 tests. Subsequent final edits add source date forwarding, raw sort/filter semantics and canonical component integration. All five tasks are complete; final evidence follows. No browser screenshot or live-backend verification was performed; source and automated evidence do not establish pixel-identical rendering.

## Final verification

- Full workspace test command passed: iap-admin 193 files / 549 tests; shared UI 17 files / 58 tests; shared forms 2 files / 11 tests.
- Final URL-adapter memoization and transition tests were then covered by 24 affected files / 71 passing tests. This final run includes source schema execution, constant/locale comparison, receipt lifecycle, dialogs, disease row forwarding, claim/ticket URL state and ticket date forwarding.
- Workspace typecheck passed for both applications and packages; final admin typecheck also passed after integration. Workspace lint and architecture boundaries passed; final URL-adapter/test lint and git diff --check passed.
- Source-date, fallback-key, validation/pagination and scope adaptations are documented above. No remaining implementation blocker or pending user decision.
