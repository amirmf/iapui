# Claim request management reference port

Target: `iap-admin`, `/claim-requests/$claimRequestId/claim-request-management/` only. No child page is introduced. Worktree `/home/sadegh/.codex/worktrees/claim-request-management/iap-ui` created from `main` before inspection; branch `codex/claim-request-management`.

Reference root: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/claim-requests/$claimRequestId/claim-request-management/index.tsx`, composing `features/claim-requests/pages/claim-request-management-page.tsx`. All source paths below are relative to that reference unless explicitly marked target.

## Execution boundaries

Read `docs/architecture/APPLICATION-ARCHITECTURE.md`, `REFERENCE-PAGE-CONTROLS.md`, `LOCALIZATION.md`, and relevant repository skills before each task. The page is a journey within existing claim-requests, so its owner is `features/claim-requests/pages/claim-request-management/`. Page-exclusive components live under that page components directory; contracts belong to `@iap/api-types`; query definitions and feature services remain in their owning feature. Reusable assessment editing uses a public capability instead of cross-feature internal imports.

Source-visible names, conditions, order, API paths and Persian locale values are evidence, not a redesign opportunity. Disabled/commented source actions do not authorize new buttons. Keep server data in Query, client selection in local state/store, and routes thin. Use public `cn`, React 19 props-in-body, small component responsibilities, focused Query subscriptions and existing file/form primitives.

## Tasks and dependency order

1. [Contracts, constants and translations](01-contracts-and-constants.md): main claim contracts already exist; extend only inspected mounted operations. User confirmed strict architecture request validation with exact source fields/APIs; common pagination factory remains.
2. [Page composition and header](02-page-and-header.md): independent read/display components and source query lifecycle.
3. [Review and history](03-review-and-history.md): doctor/AI/duplicate review, objections and previous requests.
4. [Actions](04-actions.md): quick actions, role gates and workflow controls. User confirmed preserving source Tamin mocks.
5. [Files and documents](05-files-and-documents.md): public file viewer and existing Formio route; independent implementation can proceed after its audit.
6. [Assessment editing](06-assessment-editing.md): full mounted editing closure, separated into bounded component groups.
7. Verification: contract acceptance/output, HTTP method/path/body/query, source locale equality, role/status matrix, mutation success/failure sequencing, navigation, affected tests/typecheck/lint/architecture checks and build. Mark completion only after evidence is recorded.

## Accepted decisions

Implementation status: complete in the claim-management worktree. Source/unit evidence and production build pass; no browser screenshot or live-backend verification was performed.

- Reference `fanhub-tamin-service.ts` explicitly enables mocks. User confirmed preserving its mock behavior, as reference is the source of truth.
- Reference outgoing objects may retain/strip unknown fields and history page metadata is required. Current architecture requires strict requests and common nullable pagination. User confirmed retaining current architecture validation with exact source fields and API paths.

Source-only quirks (including AI result description condition and commented duplicate/approval actions) are preserved without inventing fixes. No screenshot or live backend parity is claimed by source/unit verification.
