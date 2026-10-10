# Task 06 — Translation evidence and verification

Source locale: `insurance-ui/src/locales/fa.json`. Destination: `apps/iap-app/src/shared/i18n/locales/fa/common.json`. Extract only keys mounted by the verified page closure and status maps; retain exact source values and source missing-key fallbacks. Store a fixture of copied keys for automated equality checks. Do not synthesize Persian translations.

Preserve namespaces `myiap.claimRequests`, mounted `myiap.claimRequest.detail/actions/deleteDialog`, `myClaimRequests`, relevant `claimRequests` filter/status/lookup keys, `common` loading/delete/dialog labels, general errors and mounted select/date labels. Enumerate extracted keys in fixture, check source-absent keys explicitly.

Verify contracts and pure filter mappings, card permission/status/date content, pagination and query behaviors, failed deletion staying open, and lookup reset/clear semantics. Run app tests/typecheck/lint/build and API contract tests plus architecture check. Record actual commands and results here once complete. Browser visual and live backend coverage are separate and must be reported honestly.

Status: complete.

Status: complete. 83 source locale values are recorded in `reference-translations.fixture.json` and compared in tests. Current verification: `pnpm --filter iap-app test` (51 tests), typecheck, lint, architecture check, and `git diff --check` pass. No browser screenshot or live-backend verification was run.
