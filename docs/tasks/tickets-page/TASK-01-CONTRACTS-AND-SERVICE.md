# Task 01 — ticket contracts and service

Reference: `insurance-ui/src/features/tickets/data/ticket-schema.ts`, `insurance-ui/src/features/tickets/services/ticket-service.ts`.

Target owners: `packages/api-types/src/tickets/`, `apps/iap-admin/src/features/tickets/services/ticket-service.ts`.

Implement/verify the six operations with the exact HTTP contract: `GET /support/tickets/page-full` (page, size, transformed filters), `GET /support/tickets/{id}`, `GET /support/tickets/{ticketId}/messages` (page, size), `POST /support/tickets/{ticketId}/messages` (body), `POST /support/tickets/{ticketId}/close`, and `POST /support/tickets/{ticketId}/assign_to_Latest_assessmentUser`. Parse every request and response with the exported Zod v4 schemas. Preserve reference defaults: page `0`, page size `30`, message page size `20`, and message body max `4000`.

Acceptance: invalid UUIDs and invalid enum/request shapes fail before transport; valid responses parse; service tests assert method, path, query/body placement, and defaults.
