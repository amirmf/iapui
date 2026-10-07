# Tickets page parity

> Historical audit. Superseded by [the fresh remediation audit](tickets-page/TASK-07-VERIFIED-REMEDIATION.md). Earlier completion and deferred claims are not current evidence.
## Scope

Implement the authenticated `/tickets` route in `iap-admin` with verified parity
to the reference page at
`insurance-ui/src/routes/_authenticated/tickets/index.tsx` and its mounted
TicketsPage closure. Preserve the target workspace architecture.

## Reference evidence

- Route: `insurance-ui/src/routes/_authenticated/tickets/index.tsx`
- Page composition: `insurance-ui/src/features/tickets/pages/tickets-page.tsx`
- Content and table behaviour: `insurance-ui/src/features/tickets/components/tickets-content.tsx`
- API service and schema source: `insurance-ui/src/features/tickets/services/ticket-service.ts` and `features/tickets/data/ticket-schema.ts`
- Enum display keys: `insurance-ui/src/constants/tickets-constant.ts`
- Persian translations: `insurance-ui/src/locales/fa.json` under `tickets`

## Work items

1. [completed] Create an isolated worktree from `main` on branch
   `codex/tickets-page-parity`.
2. [completed] Trace the reference page closure and inventory the target
   implementation.
3. [completed] Identify required target components and gaps.
4. [completed] Replace the `/tickets` placeholder route with the thin tickets
   feature composition.
5. [completed] Reconcile tickets page composition, query state, table behaviour,
   detail sheet lifecycle, mutations, and claim-request ticket embedding with
   the verified reference behaviour while preserving target boundaries.
6. [completed] Reuse the reference API contracts from `@iap/api-types` and
   verify method, path, request placement, defaults, and response validation.
7. [completed] Port only mounted-closure Persian `tickets.*` translation values
   exactly from the reference; retain enum-to-translation-key mappings in a
   feature-local presentation mapping because it provides a typed, single source of
   truth for labels and avoids presentation-layer enum switches.
8. [completed] Add or align focused tests for API contracts, URL/table state,
   and visible tickets behaviour.
9. [completed] Run affected tests, iap-admin typecheck and lint, and
   `git diff --check`; record evidence here.

## Component inventory

The target already has adapted counterparts for the reference page's visible
components: columns, toolbar, status filter, provider, detail sheet, detail
sheet header/actions, readonly detail, communication column, related
claim-request column, message list, and status-history dialog.

The reference component names are now represented in the target feature's
architecture: `TicketsDataTableToolbar`, `TicketRowActions`, and
`TicketMessage` live in `ui/`; `ClaimRequestsTicketsPage` follows the reference
plural naming; page composition remains in `pages/index/`.

## Claim-requests scope decision

The requester confirmed that full parity for the independent `/claim-requests`
route is out of scope. This tickets task includes only the existing
claim-request ticket embedding required by the `/tickets` reference closure.

## Completion criteria

- `/tickets` renders the TicketsPage feature rather than a placeholder.
- Mounted user-visible behaviour, API contract, schema validation, and Persian
  translation values match the reference evidence.
- Target architectural boundaries remain intact: thin route, feature-owned UI,
  package-owned contracts, and public package imports only.
- All verification commands in Work item 9 pass.

## Verification evidence

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin exec vitest run src/features/tickets` — 8 files and 16 tests passed.
- `pnpm --filter iap-admin typecheck` — passed.
- `pnpm --filter iap-admin lint` — passed.
- `git diff --check` — passed.
