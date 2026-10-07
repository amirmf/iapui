# Task 08 — tickets feature architecture review

## Scope and evidence

Owner: `apps/iap-admin/src/features/tickets`. Basis: `docs/architecture/APPLICATION-ARCHITECTURE.md`, the repository-local Zustand, TanStack Query and component-props guidance, and the source behaviour verified in Task 07.

## Changes

- Apply the single-root-route exception: place `TicketsPage` at `tickets-page.tsx`; remove empty `pages/index` wrappers and move its table search adapters to feature `route-adapters`.
- Retain reusable `TicketsContent` and the public `ClaimRequestsTicketsPage` composition because the claim-request feature consumes them through the tickets public API.
- Group the detail sheet's related components and their tests under `components/ticket-detail-sheet`. Keep small table/toolbar files together without creating a directory for every component.
- Place page/detail/messages query definitions in `queries/ticket-queries.ts`, related claim queries in `queries/ticket-related-claim-request-query.ts`, and ticket mutation definitions in `queries/ticket-mutations.ts`. Preserve query keys, enabled rules, initial-data semantics and source success sequencing.
- Keep URL parsing/navigation in `route-adapters/use-ticket-table-search.ts`; it owns no local UI state, server state or backend calls. Sorting remains local in `TicketsContent`; draft message body remains local in the detail sheet.
- Replace the server-response snapshot in Zustand with `currentTicketId`. Seed uncached ticket data in TanStack Query at selection time; retain existing fetched details. Zustand only owns selection, sheet visibility and row selection.
- Split claim-request navigation from ticket-status navigation so status controls do not import unrelated claim-request UI.
- Retain feature constants in `constants`, service validation in `services/ticket-service.ts`, backend contracts in `packages/api-types/src/tickets`, and public package/cross-feature imports. Preserve the previously approved schema exception.
- Update all imports, mocks and tests and remove empty directories. Public feature exports and the thin route remain unchanged.

## Validation

The cache-selection regression verifies uncached rows, retained fetched detail, missing IDs, and closing without removing cached server data. Existing source-schema, translation, URL, table and detail tests must continue to pass. Record final test/typecheck/lint/architecture evidence below before completion.

- Tickets regression suite: 14 files / 36 tests passed with `INSURANCE_UI_REFERENCE_PATH` pointing to the verified local reference.
- Architecture check and `git diff --check`: passed.
- Final `iap-admin` typecheck and lint: passed after correcting moved type imports.
