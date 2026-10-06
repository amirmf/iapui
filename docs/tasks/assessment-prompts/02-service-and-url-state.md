# 02 — Service and URL state

Status: Implemented; final corrections documented in tasks06/09.

## Reference

`src/features/assessment-prompts/services/assessment-prompt-service.ts`,
source page query and `use-sync-query-params-table-filter.ts`.

## Acceptance and implementation

- Exact eight method/path/body/query operations listed in the task index.
- Requests/responses validated with source-backed schemas.
- getById accepts `(id, options?: { signal })`; signals forwarded.
- Source table size40 and service fallback30.
- Query family assessment-prompts; staleTime30000; focus-refetchfalse.
- Raw agreement search, exact source page/detail contracts.
- Source date keys thruDate__from/thruDate__to; arrays use shared __in transport.
- Sorting retains page number; no invented text __like suffix.

## Evidence

13 assessment service tests, six agreement selection tests and source-backed URL
round-trip tests. Ownership remains services/queries/route-adapters. See task10
for combined verification; mocked responses do not prove live-backend behavior.
