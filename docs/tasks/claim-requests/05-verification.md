# CRP-2026-05 — Integration and evidence

- [x] Reconcile current tickets branch through its public feature API; preserve existing behavior and verify mounted branch tests. Do not expand into management-only capabilities.
- [x] Extract and compare mounted static/dynamic locale keys against reference; source-absent keys retain actual fallback rather than invented Persian.
- [x] Run affected API, feature, shared-control and ticket tests; typecheck all consuming apps/packages; lint and architecture boundaries; git diff --check.
- [x] Record pass/fail and blockers in README and each task. Distinguish source/unit evidence from real browser and live-backend evidence. Do not claim pixel parity without visual verification.
- [x] Review constants line by line for canonical names/order/colors and no duplicated translation maps. Review focused component ownership and subscriptions for unnecessary rerenders.

Final verification: complete admin suite passed (193 files / 549 tests); shared UI passed 58 tests and forms passed 11 tests. After the final memoization/URL-adapter edit, 24 affected files / 71 tests passed, including three new URL transition tests. Workspace typecheck, lint and architecture checks passed; final affected-file lint and git diff --check passed. Source/automated coverage only; no browser screenshots or live backend check.
