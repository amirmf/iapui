# Task 03 — route search and query state

Reference: `insurance-ui/src/features/tickets/components/tickets-content.tsx` and `use-sync-query-params-table-filter` usage.

Target owners: `apps/iap-admin/src/features/tickets/route-adapters/table-search.ts`, `route-adapters/ticket-filters.ts`, and `components/tickets-content.tsx`.

Preserve query keys `page`, `size`, `sort`, `direction` and pass all other filter keys through, removing UI-only `features`. Defaults are page index `0`, size `40` for the table URL, status `ASSIGNED`, sort `updatedAt`, direction `asc`. Serialize arrays with the shared API filter transformer. Pagination and sorting update only their own URL keys and retain unrelated filters; status changes reset the page.

Acceptance: parser/serializer tests cover defaults, numeric strings and non-numeric defaults, sort direction, and round trips; query key includes pagination and adapted filters; window focus refetch is disabled and stale time is 30 seconds.
