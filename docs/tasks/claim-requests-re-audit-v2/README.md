# Claim Requests — second reference audit

This task set supersedes `../claim-requests/` and `../claim-requests-reference-parity.md` as the current audit. Prior completed checks are historical, not proof of complete closure parity. Work continues in the existing `codex/claim-requests` worktree created from main.

Reference: `/home/sadegh/Android/project/insurance-ui/src/routes/_authenticated/claim-requests/index.tsx` and its complete mounted closure, including `features=tickets`. Target: `apps/iap-admin/src/features/claim-requests/claim-requests-page.tsx`.

Independent ownership: main/table controls (01), API/schema/constants/translations (02), dialogs/forms (03), tickets/shared dependencies (04). Each document records findings before its implementation. Architectural ownership remains authoritative; documented contract adaptations must not be described as identical source schemas.


## Delivery and reusable guidance

Implementation is complete. Reusable lessons and shared APIs are documented in
`docs/architecture/REFERENCE-PAGE-CONTROLS.md`; the existing
`reference-page-parity` skill already covers this workflow, so no duplicate
skill is introduced. Historical task sets are explicitly superseded.

Final checks run against the main-integrated tree are recorded below. Browser
screenshots and live backend verification were not performed. Management page
implementation remains outside this single-page task.

## Final integrated verification — 2026-10-07

Latest main (`91f8a78`, including Support Questions) was merged into the task
branch without conflicts; locked dependencies were installed before final checks.

- Full workspace tests passed: admin 206 files / 592 tests, UI 17 files / 58
  tests, forms 2 files / 11 tests.
- Workspace typecheck, lint and architecture checks passed.
- Admin production build passed. Existing vendor annotation and large-chunk
  warnings remain; they did not prevent the build.
- `git diff --check` passed. Generated Router formatting/order churn from the
  build was restored; this task introduces no route-tree changes.
- No task-owned development server or listening port was found during cleanup.

Implementation commit: `29b6a05`. Main integration commit: `fa5316f`.
The final delivery also includes the readonly-card regression test and this
verification record. The user authorized local commit, main merge and managed
worktree removal; no remote push was requested.
