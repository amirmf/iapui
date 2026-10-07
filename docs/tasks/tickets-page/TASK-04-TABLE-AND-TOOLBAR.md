# Task 04 — table, toolbar, and page states

Reference components: `TicketsContent`, `TicketsDataTableToolbar`, `TicketStatusFilter`, and `useTicketColumns` under `insurance-ui/src/features/tickets/components/`.

Target owners: matching files under `apps/iap-admin/src/features/tickets/components/`.

Compose a thin page header with translated title and refresh action, translated error and empty states, text filters for ticket number/owner/assignee, faceted priority/category filters, and the five-button status group (`ALL`, `ASSIGNED`, `WAITING_FOR_SUPPORT`, `ANSWERED`, `CLOSED`). Columns must preserve default `#ticketNumber`, claim-context `claimRequestId`, subject/category, owner, assignee, status/priority, last-message/created dates, and row actions. Use `@iap/ui` `cn` and reference presentation variants.

Acceptance: loading, fetching, error, empty, sorting, pagination, accessible pressed status buttons, and both column variants match source behaviour.
