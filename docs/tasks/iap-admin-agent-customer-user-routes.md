# Agent and customer-user route placeholders

## Scope and evidence

Requested target: `apps/iap-admin`, isolated worktree from `main` on `codex/admin-panel-routes`. Reference inspected: `/home/sadegh/Android/project/insurance-ui/src/routes/agent/**` and `src/routes/customer-user/**` (all route entries), plus their `route.tsx` authentication boundaries. Current architecture: `docs/architecture/APPLICATION-ARCHITECTURE.md`.

Verified reference page URLs (trailing index slashes normalize through the router):

| URL | Reference entry relative to `src/routes` |
| --- | --- |
| `/agent/claim-requests` | `agent/claim-requests/index.tsx` |
| `/agent/claim-requests/create` | `agent/claim-requests/create.tsx` |
| `/agent/claim-requests/$claimRequestId` | `agent/claim-requests/$claimRequestId/index.tsx` |
| `/agent/claim-requests/$claimRequestId/claim-request-management` | `agent/claim-requests/$claimRequestId/claim-request-management/index.tsx` |
| `/agent/users/create` | `agent/users/create.tsx` |
| `/customer-user` | `customer-user/index.tsx` |
| `/customer-user/claim-requests` | `customer-user/claim-requests/index.tsx` |
| `/customer-user/claim-requests/$claimRequestId/claim-request-management` | `customer-user/claim-requests/$claimRequestId/claim-request-management/index.tsx` |

`/agent` is a layout-only entry in the reference, with no index page. Preserve that distinction. Do not invent a customer-user detail page or agent dashboard.

## Implementation decisions

- Add explicit pathless groups `_authenticated/_agent` and `_authenticated/_customer-user`, with URL-bearing `agent` and `customer-user` directories underneath.
- Independence means sibling routing groups as explicitly requested; both inherit the existing authenticated shell and guard. Do not port reference layouts, sidebars, API loaders, role semantics, or business pages in this placeholder-only scope.
- Static page segments use dedicated directories; dynamic IDs remain flat route filenames, per current architecture. Management entry uses `$claimRequestId.claim-request-management/index.tsx`, avoiding an ID-only directory.
- Route entries compose the existing `@features/placeholder` public API. Preserve automatic code splitting and generate the route tree through tooling.
- Reuse existing translated titles; any missing panel-specific title belongs to the current admin locale. Preserve reference breadcrumb identifiers when available.
- No changes to `iap-app`, existing operations URLs, shared authentication, or cross-application packages.

## Tasks and acceptance

- [x] P0: Inspect architecture, relevant local skills, current placeholders, router configuration, and every reference route; record exact scope before implementation.
- [x] P1: Add the two pathless panel boundaries and all verified URL entries with small placeholder compositions.
- [x] P1: Generate the route tree; confirm dynamic params, sibling group ownership, authentication ancestry, and unchanged operations URLs.
- [x] P1: Run targeted route verification, admin typecheck/lint/build, architecture check, formatting, and `git diff --check`; record actual results and limitations.

Implementation and independent route-scope review may run concurrently after this document exists. Route generation follows route creation; final checks follow generation.

## Validation

Completed in the requested isolated worktree. All eight reference page URLs and both panel roots exist; existing generated full paths remain intact.

- `pnpm --filter iap-admin exec vitest run src/shared/router/panel-routes.test.ts`: passed, 9 tests. Uses the actual generated route tree and memory Router; checks URLs with/without trailing slashes, dynamic IDs, authenticated ancestry, mutually separate panel groups, layout-only agent root, and the existing operations branch. Only unrelated Formio rendering is mocked for jsdom compatibility.
- Source-to-source URL inventory: passed after normalizing trailing slashes. Current Router intentionally uses `trailingSlash: 'always'`; the two reference create routes therefore gain canonical trailing slashes under the current architecture. Both forms resolve, as verified by runtime tests.
- Existing generated full-path preservation and exact source Persian title comparison: passed.
- `pnpm --filter iap-admin build`: passed (Vite build and TypeScript). Build reported vendor annotation and large-chunk warnings; no build errors.
- Final `pnpm --filter iap-admin typecheck`, `pnpm --filter iap-admin lint`, `pnpm architecture:check`: passed, including the new test.
- Changed-file Prettier check and `git diff --check`: passed.
- Final local review using `code-reviewer`: no actionable findings. Routes remain thin; placeholder composition uses the existing feature public API; panel entries inherit the unchanged authenticated guard and shell; no API calls, role changes, or shared package changes were added.

An initial test invocation accidentally selected the broader suite and was stopped; reference-dependent tests reported the absent sibling reference checkout in the managed worktree. No full-suite success is claimed. The corrected targeted command above passed. Initial Router test collection required mocking unrelated Formio rendering; the final run passed all tests.

Placeholder scope does not claim reference layout/UI parity, browser screenshot verification, or live backend verification. Local integration into `main` is authorized for final delivery; no deployment is part of this task.

## Maintenance handoff

The reusable panel placement and page replacement guidance is recorded in
`docs/architecture/APPLICATION-ARCHITECTURE.md` under Admin panel route partitions.
Existing Router and reference-parity skills cover this workflow; no additional
skill is needed for these thin placeholder routes. No development server or
listening port was opened by this task.
