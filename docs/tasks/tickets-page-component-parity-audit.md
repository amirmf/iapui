# Tickets page component parity audit

> Historical audit. Superseded by [the fresh remediation audit](tickets-page/TASK-07-VERIFIED-REMEDIATION.md). Earlier completion and deferred claims are not current evidence.
## Scope and source of truth

This audit compares the complete mounted closure of the authenticated tickets
page in `iap-admin` with the reference implementation in `insurance-ui`.
Reference source paths are under `src/features/tickets/`, plus
`src/features/claim-requests/components/claim-requests-tickets-page.tsx` for
the tickets-in-claim-requests composition.

The target preserves its architecture: route composition in `app`, product
behaviour in `features/tickets`, and endpoint schemas in `@iap/api-types`.

## Verified parity

- The `/tickets` route resolves to `TicketsPage` in both applications.
- Persian `tickets` locale objects are byte-for-byte equal when serialized from
  their parsed JSON values.
- All six support-ticket endpoint paths and their HTTP verbs match the
  reference service.
- Target enum label and colour mappings cover the same status, priority, and
  category values as `tickets-constant.ts` in the reference.
- The target has counterparts for every mounted reference component.

## Discrepancies and implementation tasks

1. [completed] **TicketsContent composition — high.** The target page embeds a
   private content component instead of an explicit reusable `TicketsContent`.
   Extract it with the reference props (`beforeStatusFilter`, `title`, column
   variant, status-filter variant) so the standalone route and
   `ClaimRequestsTicketsPage` share one verified implementation.
2. [completed] **Default table first column — critical.** Reference `/tickets`
   shows `#ticketNumber`; the target always shows `claimRequestId`. Restore the
   `default` and `claim-request-context` column variants exactly.
3. [completed] **Claim-request tickets composition — high.** The target duplicates
   query, header, toolbar, table, and sheet logic. Replace it with the reference
   composition using the extracted `TicketsContent` and pass the claim-request
   variants and preceding quick-status control.
4. [completed] **Toolbar API and enum options — high.** Restore
   `beforeStatusFilter`, status-filter variant, reference query-param ignore
   behaviour, and typed enum option factories rather than manually authored
   string arrays. Adapt prop names only where the target shared table primitive
   requires it.
5. [completed] **Status filter — high.** Derive the visible status subset from
   `ticketStatusSchema`, restore the `claim-request-context` visual variant,
   and retain target-safe navigation without hard-coding a different state
   contract.
6. [completed] **Standalone page presentation — medium.** Match the reference
   header/error composition (including the error container and title wrapper)
   while using the target application shell rather than importing reference
   layout internals.
7. [completed] **Detail sheet header and metadata — medium.** Restore the header
   wrapper, base outlined status-badge styling, and reference owner-name
   fallback semantics.
8. [completed] **Detail sheet mutation sequencing — high.** Restore the reference
   sequencing: refetch ticket/messages and parent page in order, then close the
   sheet. Do not introduce parallel mutation completion behaviour that differs
   from the source.
9. [completed] **Communication controls — medium.** Restore source disabled-state
   rules for close/send controls and the textarea. Keep target accessibility
   additions only when they do not alter visible or interactive source behaviour.
10. [deferred] **Related claim-request panel — high.** The reference uses
    `ClaimRequestReadonlyInfoList`, `AssessmentItemsCardList`, and the
    special-disease capability. These target counterparts and their required
    claim-request translations are not yet implemented; the current target
    renders only a reduced summary. This remains intentionally isolated for the
    separate claim-requests task.
11. [completed] **Status-history dialog — medium.** Reconcile history-entry user
    labels, icon mapping, transition presentation, and badge styles with the
    source using target UI primitives.
12. [completed] **Service defaults — medium.** Keep the verified endpoint methods
    and paths, and restore reference defaults for page ticket and message
    requests before transport serialization. Validate all inputs and responses
    through the target package schemas.
13. [completed] **Schema contract tests — high.** Add source-backed tests for
    valid and invalid ticket request/response shapes, including page defaults
    and message limits. Do not invent fields or translation values.
14. [completed] **Regression tests and verification — high.** Tickets feature
    tests cover table URL state, status-filter navigation, request defaults and
    invalid requests; the full tickets test set, typecheck, lint, and
    `git diff --check` passed.

## Component inventory

| Reference component | Target counterpart | Audit result |
| --- | --- | --- |
| `TicketsPage` | `pages/index/tickets-page.tsx` | Aligned. |
| `TicketsContent` | `ui/tickets-content.tsx` | Shared composition aligned. |
| `TicketsDataTableToolbar` | `ui/tickets-data-table-toolbar.tsx` | Aligned. |
| `TicketStatusFilter` | `ui/ticket-status-filter.tsx` | Aligned. |
| `useTicketColumns` | `ui/ticket-columns.tsx` | Default and claim variants aligned. |
| `TicketRowActions` | `ui/ticket-row-actions.tsx` | Behaviour aligned; retained. |
| `TicketDetailSheet` | `ui/ticket-detail-sheet.tsx` | Aligned. |
| `TicketDetailSheetHeader` | `ui/ticket-detail-sheet-header.tsx` | Aligned. |
| `TicketReadonlyDetail` | `ui/ticket-readonly-detail.tsx` | Aligned. |
| `TicketCommunicationColumn` | `ui/ticket-communication-column.tsx` | Aligned. |
| `TicketDetailSheetActions` | `ui/ticket-detail-sheet-actions.tsx` | Aligned. |
| `TicketMessageList` / `TicketMessage` | matching `ui/` files | Behaviour aligned; retained. |
| `TicketRelatedClaimRequestColumn` | matching `ui/` file | Reduced target content; requires port. |
| `TicketStatusHistoryDialog` | matching `ui/` file | Aligned. |
| `TicketProvider` / context | `ui/ticket-provider.tsx` + store | Target-architecture adaptation; lifecycle aligned. |
| `ticket-schema` | `@iap/api-types/support-ticket` | Contract defaults and validation covered. |

## Completion criteria

- All tickets-owned tasks above are completed with source-backed evidence. The
  one claim-requests capability is explicitly deferred to its dedicated task.
- The standalone and claim-request ticket views share `TicketsContent` and
  expose the same mounted behaviour as the reference.
- No API field, endpoint, locale value, or schema condition is inferred.
- Target route, feature, package, and import boundaries remain compliant with
  `docs/architecture/APPLICATION-ARCHITECTURE.md`.
