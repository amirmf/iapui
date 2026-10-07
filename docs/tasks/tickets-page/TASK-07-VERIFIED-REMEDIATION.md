# Tickets page fresh parity audit and remediation

This audit supersedes `../tickets-page-parity.md`, `../tickets-page-component-parity-audit.md`, and earlier status claims in this folder. Source root: `/home/sadegh/Android/project/insurance-ui`. Target root: this worktree. Compare behaviour, not import/layout changes required by the accepted architecture.

## Verified discrepancies and tasks

- [x] P1 `TicketsContent`: target renders a bare section; source renders `Main` with card background, padding, rounded corners, shadow and flex layout. Use the existing target `Main` counterpart.
- [x] P1 enum constants: target priority and category maps are alphabetized, so faceted options appear HIGH/LOW/NORMAL/URGENT and CLAIM_ISSUE/INFO_ISSUE/PAYMENT. Preserve source LOW/NORMAL/HIGH/URGENT and PAYMENT/CLAIM_ISSUE/INFO_ISSUE. Restore canonical source constant names in a feature-owned constants file.
- [x] P2 `TicketStatusFilter`: target builds translation keys inline; source consumes the centralized status translation map. Use source map.
- [x] P2 `TicketMessageList` / `TicketMessage`: visibility label/class props from the source were omitted. Restore the props and centralized visibility maps without rendering the commented-out badge.
- [x] P2 `TicketReadonlyDetail`: status button uses default badge variants while other badges use reference presentation. Compose Badge asChild with reference presentation around the status button.
- [x] P2 `TicketStatusHistoryDialog`: source formats missing timestamps to `-` and renders them; target suppresses the timestamp for null/undefined/empty. Preserve source fallback rendering.
- [x] P2 `TicketRelatedClaimRequestColumn`: navigation icon is Lucide ExternalLink instead of source Tabler IconExternalLink. Use the verified source icon. The target already mounts ClaimRequestReadonlyInfoList and readonly assessment cards; the earlier reduced-panel/deferred claim is stale.
- [x] P2 service API: source methods are getPageFull/getById/getMessages with signal in a second options argument; target renamed them findPage/findById/findMessages and moved signal into input. Restore source API names and call shape.
- [x] P2 ownership: presentation constants and URL filter adaptation are under model, violating the data-contract-only boundary. Move constants to constants/tickets-constant.ts and filter adaptation to route-adapters.
- [x] P1 contract acceptance: reference accepts absent/null page content, signed integer page/size, requires filters, and strips unknown request fields. Target common factories require content, default filters, constrain page/size, and reject extra keys. User selected exact reference schema acceptance; scoped decision is recorded in docs/architecture/TICKETS-REFERENCE-CONTRACT.md. Public ownership remains @iap/api-types.

- [x] P1 related assessment query lifecycle: source starts assessment query alongside claim request query and disables it with sheet closure; target mounted it only after claim request data existed and left its observer active during loading/closure. Invoke the existing public useAssessmentItemsData hook at the column boundary and compose AssessmentItemsCardList like source.
- [x] P2 URL number acceptance: source normalizeNumber accepts numeric strings including zero, negative and fractional values; target parser rejected these. Preserve source normalization.

- [x] P1 shared filter reset: source resets every search key, including status/features/sorting. Target preserves ignored status/features. Add an opt-in resetIgnoredQueryParams capability and enable only for tickets. Source writes page 1 when changing a filter at page >1; target default deletes it. Forward resetPageToFirst.

> Final architecture/ownership is recorded in Task 08; the inventory below describes the parity pass before the file regrouping. Final release verification: 23 files / 62 tests passed (tickets and affected shared filters).

## Direct component inventory

| Component | Inspected result |
| --- | --- |
| TicketsPage | Provider/content composition matches; target ownership adaptation retained. |
| TicketsContent | Main discrepancy above; query caching and refresh/error/empty states match. |
| TicketsDataTableToolbar | Text/filter IDs and props match; option order discrepancy above. |
| TicketStatusFilter | Subset/order/count/navigation match; central map discrepancy above. |
| useTicketColumns | Fields, variants and date pipeline match; memoization retained; assignee span instead of source div to align. |
| TicketRowActions | View action and tooltip match. |
| TicketDetailSheet | Query IDs, message size 100, body guard, close/send success sequencing match. |
| TicketDetailSheetHeader | Title fallback and description match. |
| TicketCommunicationColumn | Disabled rules, body limit and states match; accessible hidden label/live regions retained. |
| TicketDetailSheetActions | Buttons, pending rules, labels and icons match. |
| TicketReadonlyDetail / TicketMetadataItem | Owner fallback and metadata match; status badge presentation discrepancy above. |
| TicketMessageList / TicketMessage | Source bubble layout/sender/body/date match; visibility props discrepancy above. |
| TicketStatusHistoryDialog | Icons, user labels, reversed order, colors match; missing timestamp discrepancy above. |
| TicketRelatedClaimRequestColumn | Query and state layout match; icon discrepancy above; assessment query lifecycle audited below. |
| TicketProvider / store | Zustand selectors and reset-on-unmount match. |
| Route | Thin feature composition matches; no child ticket routes. |

## Verification limits

This is source-level evidence. No live-backend or screenshot parity is claimed. Shared table/filter primitives use existing opt-in reference presentation. The user approved the scoped source-schema exception, implemented in @iap/api-types and documented in TICKETS-REFERENCE-CONTRACT.md.

## Completion evidence

- Branch: `codex/tickets-reference-parity`; worktree created from `main` before edits.
- Tickets and shared filter suite: 19 files / 55 tests passed.
- Added lifecycle, history fallback and reset/default-preservation regressions: 3 files / 4 tests passed.
- Direct source-schema acceptance/output/error comparison: 10 tests included in the tickets suite (9 operation/response schemas and complete Persian tickets locale).
- Literal translation-key scan over every reference ticket component found no missing target literal keys.
- `iap-admin` and `iap-app` typechecks passed after the shared contract change.
- Final admin lint and architecture check passed after all code/test additions; git diff --check passed.
- No screenshot/browser or live-backend claim is made. Related claim-request internals retain their public feature ownership and established implementation; this change corrects tickets composition and query lifecycle.
