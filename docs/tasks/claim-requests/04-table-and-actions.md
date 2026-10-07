# CRP-2026-04 — Table presentation and focused row dialogs

Evidence: reference claim-requests-page.tsx getClaimRequestRowClassName, claim-request-columns.tsx, claim-request-row-actions.tsx, row-actions/claim-request-row-actions-assign-to-me-confirm-dialog.tsx, row-actions/claim-request-row-actions-remove-my-assessment-confirm-dialog.tsx, claim-request-delete-dialog.tsx.

- [x] Add focused disease badges under extDisplayName using exact SPECIAL_DISEASE_TRANSLATE_KEY/specialDiseaseColors. VIP row primary tint; other nonempty disease rows destructive tint; empty no class. Preserve special-disease-row marker and selected/hover tokens.
- [x] Forward reference presentation to table headers, cells/empty ASCII dash, badges/actions/tooltips and confirmations where supported. Match amount null fallback '-'. Keep canonical columns/order.
- [x] Correct row view label actions.view, remove-assessment missing doc type messages.docTypeUpdateFailed, assignment success styling.
- [x] Split combined row dialogs into canonical assign/remove/delete components; inspect actual source mutation sequencing before edits. Remove assessment awaits refetch before close; failure must keep confirmation open; pending forbids dismissal.
- [x] Refactor page query under queries/ and page/router wiring under route-adapters/; use absolute feature imports and body props destructuring.
- [x] Preserve existing source management links; management implementation is outside scope.
- [x] Test rendered diseases/row classes, exact labels, pending/rejected operations, refetch-before-close and selected IDs.

Source-absent keys: `claimRequests.actions.view` and `claimRequests.messages.docTypeUpdateFailed` are used in source but absent from its Persian locale. Preserve their literal key fallback; do not invent translated replacements.

Final integration: canonical filenames and exported component names match source; page entry is feature-root owned, rendering a focused ClaimRequestsContent. Query definitions are in queries/; pagination, sorting and quick-status URL writes are in route-adapters/. All four bulk mutations refetch without awaiting before closing/clearing selection; assign/remove confirmations await refetch. Source Trash/Send titles, reference controls, ASCII empty values and host-language/no-normalization date semantics are preserved.

Final verification: complete admin suite passed (193 files / 549 tests); shared UI passed 58 tests and forms passed 11 tests. After the final memoization/URL-adapter edit, 24 affected files / 71 tests passed, including three new URL transition tests. Workspace typecheck, lint and architecture checks passed; final affected-file lint and git diff --check passed. Source/automated coverage only; no browser screenshots or live backend check.
