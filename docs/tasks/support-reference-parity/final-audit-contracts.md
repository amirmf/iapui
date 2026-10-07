# Final Support contracts, localization and names audit

Date: 2026-10-07. This fresh inspection uses the actual local reference at
`/home/sadegh/Android/project/insurance-ui`, not earlier task descriptions.
It supersedes the contract and localization conclusions in the earlier re-audit.

## Scope and accepted exceptions

- Reference `src/features/support/data/support-flow-schema.ts` maps to the
  flow section of `packages/api-types/src/support/index.ts`.
- Reference `src/features/support/data/my-iap-ticket-schema.ts` and its nested
  `src/features/tickets/data/ticket-schema.ts` closure map to
  `packages/api-types/src/tickets/index.ts`.
- Reference `src/features/support/services/support-service.ts` maps to
  `packages/support/src/services/support-service.ts`.
- Source claim-status enum, claim/ticket translation maps and input-display
  constants were inspected as reachable dependencies. Separate Support
  administration contracts are outside this widget closure.
- Paginated `content` is `.nullish()` by explicit user decision, including
  Support options whose source rejects `null`. Present items still validate.
  The differential oracle applies this exception before composing nested flow
  responses. Request pagination and unknown-key semantics remain source-based.
- My-IAP pages and placeholders must not exist in `iap-admin`; shared widget
  ticket contracts and their `/my/iap-ticket` backend endpoints remain required.

## API results

| Exact method name | Method and path | Verified placement |
| --- | --- | --- |
| `publicAnswer` | POST `/support/answer` | Parsed body, signal, `withCredentials: true` |
| `myAnswer` | POST `/support/my/answer` | Parsed body and signal |
| `getMyIapTicketById` | GET `/my/iap-ticket/tickets/{ticketId}` | Parsed UUID path and signal |
| `getMyIapTicketMessages` | GET `/my/iap-ticket/tickets/{ticketId}/messages` | Parsed page/size query and signal |
| `getMyIapTickets` | GET `/my/iap-ticket/tickets/page-full` | Page/size followed by spread filters and signal |

All five operation names, request and response schema names, transport options,
query ordering and filter override behavior match the source. Invalid outgoing
requests are rejected before transport. Each response is parsed at the boundary.
The target obtains the client through its public workspace package API.

## Schema results

All 29 exported schemas in the source flow, My-IAP request and complete tickets
schema files retain their public names. Manual inspection covered every field
of ticket messages, users, status/assignment histories, tickets, page metadata,
flow contexts, options, selectable questions and responses. Enums and their order,
UUID versus unrestricted string IDs, integer versus number acceptance, required
query/filters, optional request page/size without bounds/defaults, response loose
objects and request stripping match. Context object values retain unknown fields.

Zod v4 `.loose()` replaces source `.passthrough()` with equivalent behavior;
`.nullish()` replaces `.nullable().optional()` where both values were already
accepted. These syntax adaptations are distinct from the explicit broader
Support options content acceptance.

The existing actual-source differential suite compares acceptance, parsed output
and complete ordered validation issues for recursively generated nested cases.
It additionally executes the actual source service against the same mocked client.
No unapproved production schema or API discrepancy was found.

## Localization and component names

Both application Persian locales match the complete source `supportFlow` subtree,
covering dynamic option-field labels. Every literal translation call in source
Support and every target claim/ticket status translation leaf matches the source
value, including absent keys. Source claim map and its four My-IAP overrides
were inspected directly: delegated/dedicated/sent-failed use `inAssessment`, and
sent uses `send_customer`. Ticket status mappings and unknown-status fallback
match. No new translation or invented fallback was added.

The TypeScript AST name check passes for all 24 source component TSX files,
including public/private function names. The provider's target folder changes
to `context/provider` under the approved architecture; its name is preserved.
Visual/interaction component inspection is reported separately by this audit.

## Fresh verification

- 34 actual-source contract/service differential tests passed.
- 7 request/response boundary service tests passed.
- 44 workspace page-content tests passed, covering 43 exported page schemas.
- 3 actual-source component-name and both-app locale tests passed.

Total in this audit scope: 88 tests passed. No production edit was needed for
contracts, translation values or component names. These checks use the local
source and mocked transport; they do not establish live-backend or pixel parity.
