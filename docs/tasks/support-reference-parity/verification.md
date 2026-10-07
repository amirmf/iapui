> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Integrated verification

Historical implementation evidence. The fresh complete audit and final integrated results are in [reaudit.md](reaudit.md).

## Completion

- [x] Inspected the complete reference Support inventory and mounted dependencies.
- [x] Preserved canonical component names, endpoint paths and schema acceptance.
- [x] Implemented the flow history, stale-response guards, rollback, feature entry and paginated options.
- [x] Implemented the source Markdown, input, question/option rows, virtualized lists and ticket views.
- [x] Composed widgets in admin operations, agent, customer-user and auth shells; login has its source mobile footer entry.
- [x] Kept My-IAP destinations as thin placeholders only.
- [x] Preserved source Persian `supportFlow` subtree and 24 mounted status translation leaves in both shared-package consumers.
- [x] Added source tenant navigation colors through the existing build-time configuration owner.
- [x] Recorded global optional response content and scoped Support request semantics.

## Evidence

Final focused Support package suite: 47 tests across five files passed. Covers route-context normalization, initial availability, feature flow, stale responses, rollback, pagination, Markdown formatting and internal navigation, and ticket ownership/query boundaries.

Admin Support API integration: seven tests passed, including the common optional-content factory, source schema rejection cases, five endpoint placements, AbortSignal forwarding and public credentials. Panel routing: 12 tests passed, including three My-IAP placeholder destinations. Source claim locale tests also passed in the focused 22-test run.

Shared UI suite: 62 tests across 19 files passed, preserving default and reference primitive behavior. Source parity consumers use scoped Button, Textarea, Badge and Tooltip presentation. Question tooltips retain zero-delay provider behavior.

Both application typechecks, Support/API-types/Auth typechecks, admin lint, scoped Support/Auth lint, architecture check and whitespace checks passed. Production builds for iap-admin and iap-app passed. Final presentation-only changes were additionally covered by Support tests/typechecks and scoped lint; builds preceded the final reference-control props and tooltip provider import.

The broader admin run passed 215 of 225 files initially; the remaining ten files failed solely because the worktree's expected sibling reference checkout did not exist. After supplying `INSURANCE_UI_REFERENCE_PATH` and a local sibling symlink to the actual reference, all eight affected locale/status files passed (10 tests) and both affected schema suites passed (13 tests). No source acceptance defect was found in those reruns. The full suite was not repeated after restoring its reference path.

## Limits and intentional boundaries

These are source, contract, component-test and build results. No screenshot comparison or live-backend session was performed; pixel identity and server availability are not asserted.

My-IAP links resolve to placeholders in admin. My-IAP business pages were explicitly excluded by the user. The source RecentTickets hook does not add an ANSWERED filter despite its display label; its actual request is preserved. Existing iap-app callers retain their public SupportWidget/SupportNavigationButton entries; shared package locale requirements were verified for both applications.

The source Markdown helper closure is private to the Support message component. The source flow uses Zustand response snapshots as transient step history; the ticket server-state queries remain owned by TanStack Query. No cross-application source imports or support/auth dependency cycle were introduced.
