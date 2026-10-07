> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Support window fresh component audit

Date: 2026-10-07. This report supersedes earlier completion claims for the window scope. Reference: `/home/sadegh/Android/project/insurance-ui/src/features/support/components/support-flow-window/`. Target: `packages/support/src/components/support-flow-window/`.

## Method and result

Read every reference implementation file and every target counterpart, inspected complete textual diffs, and traced mounted Button, Textarea, authentication, theme, date formatting, amount formatting, status translations, and markdown text-style helpers. No additional discrepancy requiring a window-local implementation edit was found. This is source and contract evidence, not a browser screenshot or live-backend check.

## Complete implementation inventory

| Reference and target filename | Audited behavior |
| --- | --- |
| `index.tsx` | `SupportFlowWindow`; chat/tickets/details branches, authenticated My-IAP gating, recent-ticket rendering readiness, reset/back refresh sequencing, persisted list scroll offset, close cleanup, mobile scroll lock and resize listener cleanup, dialog accessibility, every JSX class and property. |
| `support-flow-window-header.tsx` | `SupportFlowWindowHeader`; title, close label/callback, auth/default color context, theme-selected configured background, IconBot and ShieldCheck markup, every JSX class. |
| `support-flow-window-actions.tsx` | `SupportFlowWindowActions`; back/reset names, translated labels, pending and history disabling, callback wiring, button sizes/variants/classes. |
| `support-flow-window-error.tsx` | `SupportFlowWindowError`; alert role, absent-error branch and unmodified displayed error. |
| `support-flow-window-loading.tsx` | `SupportFlowWindowLoading`; loading gate, spinner and translated loading text. |
| `support-flow-message.tsx` | `SupportFlowMessage`; full markdown plugin closure, editor style conversion, allowed elements, URL validation, internal Router navigation and safe external anchors. |
| `support-flow-user-message.tsx` | `SupportFlowUserMessage`; backward search for `USER_MESSAGE_PREFIX`, whitespace normalization, absent/empty message suppression and prewrapped bubble. |
| `support-option-list.tsx` | `SupportOptionList`; memoized row details, dynamic row height key, remaining-height/width resize observers, initial-row scroll reset, overscan, loading row, load-more trigger, effect cleanup, list accessibility. |
| `support-option-row.tsx` | `SupportOptionRow` and private `SupportOptionLoadingRow`; loading-row dispatch, question/response dispatch, forwarded virtualized aria/style props, translated loading label. |
| `support-question-list-item.tsx` | `SupportQuestionListItem`; label, selected option callback, disabled state, outline presentation and icon/classes. |
| `support-response-option-list-item.tsx` | `SupportResponseOptionListItem`; business key, status, date, amount, label/display-name suppression and secondary details, selected option callback and every class. |
| `support-text-input.tsx` | `SupportTextInput`; local value, trimmed submission, blank/pending suppression, post-submit clearing, placeholder, translated submit accessibility label, textarea and submit styling. |
| `support-option-details.ts` | `useSupportOptionDetails`; display-value rules, exact detail field order, date/amount conversions, claim-status precedence over ticket statuses, unknown-status fallback and dynamic field translation keys. |
| `support-option-list-types.ts` | Same public types, field order and row-height/padding constants. |
| `support-option-row-height.ts` | Same measured-height preference, estimates, wrapping thresholds, label/display-name/detail line accounting. |
| `use-support-flow.ts` | Same Zustand subscriptions, initial loading effect, question/option mapping, text-input branch, active-step derivation and reset/select/load-more/submit/feature-opening callbacks. API execution remains in the store/service closure audited separately. |

All source implementation filenames and component/hook names in this directory are preserved. `support-flow-message.test.ts` also exists in both trees; target includes the 11 source-backed rendering and navigation cases.

## Dependency equivalence and deliberate adaptations

- Button and Textarea imports use the package public API with `presentation='reference'`. All window-mounted variants/sizes are covered: default, outline, ghost, sm and icon. Textarea reference class tokens match the source. Button reference presentation restores source disabled background/text/pointer behavior and ghost hover styles. The shared Button component adds a default `type='button'`, but every window button specifies its type explicitly.
- No Skeleton primitive is mounted by this window directory; loading uses `Loader2`. Ticket child components have their own dependency audit.
- Date formatting explicitly supplies `i18n.language`, `normalizeTimezone: false`, and `invalidDate: 'throw'`, matching source parsing, Tehran conversion, Jalali/Gregorian selection and invalid-date behavior. Amount formatting reproduces the source `Intl.NumberFormat(undefined)` with zero fractional digits and its finite-number-only acceptance.
- `support-option-status.ts` contains the exact claim-status translation map and the exact four My-IAP overrides; ticket keys come from the centralized target ticket map. Translation value comparison is covered by the separate locale audit.
- `markdown-editor-colors.ts` and `markdown-editor-font-size.ts` match the source helper files. `markdown-editor-text-style.ts` differs only by materializing `URLSearchParams.entries()` with `Array.from`; iteration order and output remain the same. These private copies maintain public package boundaries rather than importing application internals.
- Import ownership, `type` qualifiers, props destructuring inside component bodies and formatter class-token ordering follow the target architecture without changing the inspected behavior.
- `document.documentElement` replaces the source's first `html` lookup and selects the same element. Optional access to a missing message index and an absent virtualized row adds safe empty/null handling for out-of-range values; valid array entries and valid rows behave identically.
- Authentication uses the application's established `@iap/auth` session. Theme reads the established `@iap/theme` store; its global contract exposes explicit light/dark themes, whereas the reference context also supports system theme. The header's light/dark selection matches for supported target values. Expanding the application-wide theme preference model is outside this Support component audit.
- My-IAP pages remain placeholders by explicit user decision; this does not remove the support widget's chat/window branches.

## Verification

- `pnpm --filter @iap/support test -- src/components/support-flow-window/support-flow-message.test.ts`: passed all 47 package tests, including all 11 message cases (the script forwarded the argument after `--` and ran the complete package suite).
- `pnpm --filter @iap/support typecheck`: passed.
- `apps/iap-admin/node_modules/.bin/eslint --config apps/iap-admin/eslint.config.js packages/support/src/components/support-flow-window`, invoked from repository root: passed. An initial invocation from the app directory was rejected because package files were outside its lint base; the root invocation above correctly covers them.
- `git diff --check`: passed at the audit checkpoint.

No screenshot comparison, responsive browser interaction run or live-backend execution was performed in this audit.

Final integrated checks after all audit corrections are recorded in [reaudit.md](reaudit.md).
