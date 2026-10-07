# Tickets page — completed implementation and audit

Target: the authenticated `/tickets/` page in `iap-admin`; no child ticket URLs.
Reference: `insurance-ui/src/routes/_authenticated/tickets/index.tsx` and its
mounted `TicketsPage` closure. Product behaviour, API method/path/body/query
placement, enum maps and Persian strings come from inspected reference source.

## Task index

1. [Contracts and service](TASK-01-CONTRACTS-AND-SERVICE.md).
2. [Constants and localization](TASK-02-CONSTANTS-LOCALIZATION.md).
3. [Route search and query state](TASK-03-ROUTE-SEARCH-AND-QUERY.md).
4. [Table and toolbar](TASK-04-TABLE-AND-TOOLBAR.md).
5. [Detail sheet and mutations](TASK-05-DETAIL-SHEET-AND-MUTATIONS.md).
6. [Route composition and verification](TASK-06-ROUTE-COMPOSITION-AND-VERIFICATION.md).
7. [Fresh parity audit and remediation](TASK-07-VERIFIED-REMEDIATION.md).
8. [Architecture review](TASK-08-ARCHITECTURE-REVIEW.md).

All documented implementation items are complete. Tasks 07 and 08 supersede
baseline assumptions and the two historical tickets audits in the parent folder.

## Final ownership

- `features/tickets/tickets-page.tsx`: single-route page composition.
- `components/`: reusable table/toolbar and embedded claim-request composition;
  `components/ticket-detail-sheet/`: detail, messages and history components.
- `context/store/` and `context/provider/`: UI selection, visibility and lifecycle;
  ticket responses remain in TanStack Query cache.
- `queries/`: server queries and mutations. `route-adapters/`: URL parsing,
  filter adaptation and navigation without owning UI/server state.
- `constants/`: reference enum labels, colors and ordered option factories.
- `services/ticket-service.ts`: source operation names and boundary validation.
- `packages/api-types/src/tickets/index.ts`: public backend contracts with the
  [approved scoped schema exception](../../architecture/TICKETS-REFERENCE-CONTRACT.md).

The related claim-request information and readonly assessment cards stay in
their existing owning features; tickets consumes their public APIs and starts
the related queries with the reference lifecycle. Unrelated claim-request pages
are outside this task.

## Verification

The final architecture pass recorded 36 tests across 14 tickets files, plus
admin typecheck, lint and architecture checks. Final release verification below
covers tickets and the affected shared filter controls together. No screenshot
or live-backend verification is claimed.

## Reusable guidance

[Reference-page controls](../../architecture/REFERENCE-PAGE-CONTROLS.md#tickets-integration-lessons)
records the cache/selection, query ownership, filter reset and contract lessons.
The existing repository `reference-page-parity` skill already reads that guide;
a duplicate skill is unnecessary.

Final release verification on 2026-10-07:
`INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin exec vitest run src/features/tickets src/shared/tables/filter`
passed: 23 files / 62 tests. Architecture check and `git diff --check` passed.
Git commit hooks run workspace typecheck, lint and formatting before commit.
