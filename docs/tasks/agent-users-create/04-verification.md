# 04 — Verification

Status: focused verification complete.

- `pnpm --filter iap-admin exec vitest run src/features/agent-users src/shared/router/panel-routes.test.ts`: 5 files, 41 tests passed (29 signup tests and 12 existing panel route tests).
- Coverage: request defaults, trimming and unknown-key stripping; password boundaries and matching; exact POST path/body; response empty-string normalization and invalid responses; locale snapshot equality; nationality order/labels; actual public form primitives and field order; tab changes retaining code; invalid field errors; pending button; failure retaining values; success reset and toast.
- `pnpm --filter iap-admin typecheck`: passed.
- `pnpm --filter @iap/api-types typecheck`: passed.
- `pnpm --filter iap-admin lint`: passed.
- `pnpm architecture:check`: passed.
- `git diff --check`: passed.

Shared Card/Input/Tabs/Form/Button source was inspected against the mounted reference primitives. Local Tabs root classes restore source spacing; Button opts into reference disabled presentation; field labels retain source markers. Card heading semantics follow the target public primitive. No shared default styling changes.

An initial `pnpm test -- ...` invocation unexpectedly selected the full suite rather than the focused paths. It was stopped; unrelated tests requiring a sibling insurance-ui path failed because the worktree has a different parent. The corrected direct Vitest invocation above passed. This is not a claim of full-suite verification.

Browser screenshots and live-backend registration were not performed. Unit/source checks do not establish pixel-identical rendering or backend deployment compatibility. No production accounts were created.

`pnpm --filter iap-admin build`: passed (Vite bundling and TypeScript build). Existing warnings include large chunks and circular assessment-item/claim-request chunks outside this page. Router plugin regenerated import ordering only; that unrelated generated-file diff was discarded because no routes were added or removed.

Historical verification: superseded for parity claims by [the second closure audit](../agent-users-create-re-audit/README.md).
