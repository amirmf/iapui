# Final Support window audit

Date: 2026-10-07. This fresh audit supersedes `reaudit-window.md` for the window closure.

Reference root: `/home/sadegh/Android/project/insurance-ui/src/features/support/components/support-flow-window/`.
Target root: `packages/support/src/components/support-flow-window/` in `/home/sadegh/.codex/worktrees/support-reference-parity/iap-ui`.

## Scope and method

Read the actual implementation files and their complete source/target diffs; inspect mounted primitive implementations, date/amount formatting, claim/ticket status maps, and the Markdown editor helper closure. A programmatic comparison of all 56 literal `className` values across the 12 corresponding TSX files confirmed identical class-token sets (order is formatter-dependent). Conditional class expressions, JSX attributes, effects, callbacks, and branching were inspected separately.

## Complete file inventory

| Corresponding filename | Verified responsibilities |
| --- | --- |
| `index.tsx` | `SupportFlowWindow`, chat/list/detail views, ticket list scroll restoration, recent-ticket readiness, back/reset/close sequencing, authenticated My-IAP branch gating, mobile overflow effect and resize cleanup, dialog attributes and layouts. |
| `support-flow-window-header.tsx` | `SupportFlowWindowHeader`, title/close translations, theme/configured background, auth color context, IconBot/ShieldCheck, close callback and button hover overrides. |
| `support-flow-window-actions.tsx` | `SupportFlowWindowActions`, source back/reset labels, loading/history disabled rules, callbacks, ghost/sm button presentation. |
| `support-flow-window-error.tsx` | `SupportFlowWindowError`, absent-error suppression and alert display. |
| `support-flow-window-loading.tsx` | `SupportFlowWindowLoading`, pending suppression, spinner, loading translation and classes. |
| `support-flow-message.tsx` | `SupportFlowMessage`, Markdown plugin order, supported editor style elements, raw HTML suppression, URL protocol validation, internal router links, external anchors and lazy image markup. |
| `support-flow-user-message.tsx` | `SupportFlowUserMessage`, backward user-prefix search, trimming, empty/missing suppression and prewrapped bubble. |
| `support-option-list.tsx` | `SupportOptionList`, detail memoization, dynamic row measurement key, width/height observation, cleanup, first-option reset, overscan, loading-row pagination and accessibility label. |
| `support-option-row.tsx` | `SupportOptionRow` and private `SupportOptionLoadingRow`, loading dispatch, selectable question/response dispatch, aria/style forwarding and disabled/select callbacks. |
| `support-question-list-item.tsx` | `SupportQuestionListItem`, outline presentation, source option label, icon, pending disabling and original selection object. |
| `support-response-option-list-item.tsx` | `SupportResponseOptionListItem`, business key/status/date/amount grouping, redundant display name suppression and selection callback. |
| `support-text-input.tsx` | `SupportTextInput`, trim/blank/pending submission guards, clearing after callback, placeholder/aria labels, textarea/button dimensions and safe-area spacing. |
| `support-option-details.ts` | `useSupportOptionDetails`, null/blank display rules, exact field order, source date/amount formatting, claim-status precedence and unknown-status fallback. |
| `support-option-list-types.ts` | Same field unions, field order and row/gap/padding constants. |
| `support-option-row-height.ts` | Same measured-height preference, finite-number check, default/detailed estimates, label/detail wrapping counts and width thresholds. |
| `use-support-flow.ts` | Same store subscriptions, initial loading effect, derived steps, question/option mapping and reset/select/submit/load-more/feature callback semantics. |

The 16 source implementation filenames and declared component/hook names are retained. The source `support-flow-message.test.ts` counterpart is also present. Store/API execution and ticket children are covered by the separate final audit scopes.

## Verified discrepancy and correction

The shared `Button` reference ghost presentation previously inherited `dark:hover:text-gray-50` from the target's default ghost variant. The source ghost variant has no dark-specific hover text token. The Support header close button supplies `hover:text-primary-foreground`, so the leaked dark token could supersede its intended hover color.

`packages/ui/src/button.tsx` now chooses ghost hover classes through CVA compound variants keyed by presentation. Reference ghost emits exactly the source accent hover/background tokens; default ghost keeps its existing gray hover colors. Public `buttonVariants({ variant: 'ghost' })` also retains the default behavior. Other variant contracts and default consumers are unchanged.

Three regression cases in `packages/ui/src/button.test.tsx` cover default component/public-variant classes, source reference classes without the leaked dark text override, and the actual Support header hover class override. No additional discrepancy requiring a window component edit was found.

## Mounted dependencies and architectural adaptations

- Every mounted Button/Textarea opts into `presentation='reference'`. Source base/variant/size classes match for default, outline, ghost, sm and icon; the corrected ghost behavior is included above. Buttons explicitly declare their native type.
- `markdown-editor-colors.ts` and `markdown-editor-font-size.ts` are identical to their actual source helpers. `markdown-editor-text-style.ts` only materializes URLSearchParams entries before iteration; declaration order and parsed/serialized output are unchanged.
- `support-option-format.ts` uses the exact source finite-number-only `Intl.NumberFormat(undefined)` settings with zero fractional digits.
- The local claim status map and all four My-IAP overrides match the source; ticket status keys use the centralized matching target map. Their Persian values are covered by the actual-source locale test.
- Date calls explicitly pass current translation language, `normalizeTimezone: false` and `invalidDate: 'throw'`, preserving source parsing, Tehran conversion, Jalali/Gregorian selection and invalid-date failure.
- Target public package imports and props destructuring inside function bodies comply with the current architecture. `document.documentElement` selects the same html element as the source lookup. Out-of-range option/message access is safely suppressed; normal populated entries remain equivalent.
- Authentication uses `@iap/auth`; theme uses the established explicit light/dark `@iap/theme` store. The source also exposes a global system preference; that previously documented global theme limitation remains outside the Support-local port.
- Paginated `content` is nullish under the latest accepted workspace decision even where the reference rejects null. Safe empty-list consumption is deliberate, not an accidental parity discrepancy.
- My-IAP pages/routes belong only to `iap-app`. No My-IAP placeholder or journey should be mounted in `iap-admin`; embedded Support ticket views remain in scope.

## Verification and limits

- UI focused Button/date tests: 7 passed across 2 files.
- Support message/actual-source names/locales tests: 14 passed across 2 files, including 11 Markdown cases.
- `@iap/ui` typecheck passed.
- Scoped ESLint passed for window closure and changed Button files with the application-only `react-refresh/only-export-components` rule disabled. An initial unmodified app rule run flagged the existing public `buttonVariants` export; no new lint finding was introduced by this correction.
- `git diff --check` passed at this checkpoint.

No browser screenshot comparison, mobile browser interaction run or live-backend execution was performed. Source inspection and unit checks do not establish pixel identity. Final integrated checks, including Support/app typechecks, are recorded by the combined final audit.
