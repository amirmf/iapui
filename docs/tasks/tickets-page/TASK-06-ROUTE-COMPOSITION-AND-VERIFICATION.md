# Task 06 — route composition and verification

Reference route: `insurance-ui/src/routes/_authenticated/tickets/index.tsx`.

Target route: `apps/iap-admin/src/app/router/routes/_authenticated/tickets/index.tsx` and public feature export `apps/iap-admin/src/features/tickets/index.ts`.

The route contains only `createFileRoute` and the `TicketsPage` composition. Product behaviour remains under `features/tickets`; contracts remain in `@iap/api-types`; shared visual primitives come from public package APIs. Keep `/tickets` and `/tickets/` canonicalization supplied by the router.

Before marking complete, run the tickets feature tests, `pnpm --filter iap-admin typecheck`, `pnpm --filter iap-admin lint`, and `git diff --check`. Record command results here and distinguish automated parity evidence from live-browser or backend verification.

## Verification evidence

- `pnpm --filter iap-admin exec vitest run src/features/tickets`: passed, 10 files and 20 tests.
- `pnpm --filter iap-admin typecheck`: passed.
- `pnpm --filter iap-admin lint`: passed.
- `git diff --check`: passed.
- No live browser or backend verification was performed in this task.

The initial 10-file evidence above is historical baseline verification. See TASK-07-VERIFIED-REMEDIATION.md for the latest 59-test evidence and schema exception.
