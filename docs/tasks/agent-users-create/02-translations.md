# 02 — Translations and enum audit

Source: insurance-ui `src/locales/fa.json` agent.users subtree and breadcrumb.agentUserSignup. Copy values verbatim, retain keys. Audit `src/constants/party-constant.ts` line by line: NATIONALITY_TYPE_TRANSLATION_KEYS maps to parties.nationality, not agent.users.nationality. The signup page does not import this map. Do not substitute those keys merely because Persian values happen to match.

Use a feature-owned typed nationality key map for IR, FOREIGN in source order. Schema is canonical for enum values; store translation keys, never translated strings at module initialization. Unrelated party role/status/color maps are outside the mounted closure and must not be copied.

Acceptance: programmatic Persian subtree equality and key-map order test. This centralized key-map pattern is suitable for consistency; shared business maps belong with their owner, not a global mixed-domain constant directory.

## Implementation evidence

- `apps/iap-admin/src/shared/i18n/locales/fa/common.json` contains the verbatim `agent.users` subtree and `breadcrumb.agentUserSignup` value from the reference Persian locale.
- `features/agent-users/constants/agent-user-constant.ts` preserves the schema-derived `NationalityType`, IR → FOREIGN order, and the exact signup translation keys. The option helper resolves labels when called, so language changes do not leave stale labels.
- `features/agent-users/test/fixtures/agent-user-translations.reference.json` is a source-extracted snapshot, independently compared with the reference locale by a Python equality check. The colocated constant test compares the target subtree and breadcrumb to that snapshot, verifies enum order/keys, and verifies runtime translation resolution.

## Line-by-line constant audit

All lines of reference `src/constants/party-constant.ts` were read. The following ranges group the inspected lines by responsibility without implying the signup page imports them:

| Reference lines | Verified responsibility | Decision for this page |
| --- | --- | --- |
| 1–14 | Imports from party, account and agreement schemas; nationality type inferred from schema | Use the public `@iap/api-types` nationality contract; avoid cross-feature internals. |
| 16–28 | Typed nationality translation-key map and schema-ordered option helper | Retain this pattern with the signup's actual `agent.users.nationality.*` keys. |
| 30–69 | Party role/type colors | Unmounted; do not copy. |
| 71–132 | Party role, type and status keys; account-status keys/colors | Unmounted; do not copy. |
| 134–195 | Agreement relationship/role types, keys and colors | Unmounted; do not copy. |
| 197–274 | Party and agreement option builders with explicit ordered arrays | Unmounted; do not copy or create new enum arrays. |

The centralized typed-key pattern is suitable: completeness is checked against canonical enum types and labels remain reactive to the caller's translator. The global reference file mixes party and agreement ownership, and most helpers repeat schema enum arrays. Keep maps beside their owning feature and use schema options for ordering. Existing user-account nationality keys stay `parties.nationality.*`; matching Persian labels do not authorize substituting those distinct keys in signup.

Status: implemented; focused verification passed (3 Vitest tests, scoped ESLint, exact source/fixture/target equality). Application-wide typecheck/lint, architecture and final diff verification passed in integration task 04. No browser or live-backend parity is claimed here.

Historical verification: superseded for parity claims by [the second closure audit](../agent-users-create-re-audit/README.md).
