> Historical audit: the current complete inspection and integrated verification are in [final-audit.md](final-audit.md).

> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Complete Support re-audit

Date: 2026-10-07. This is the current audit record and supersedes the initial implementation verification.

Reference: `/home/sadegh/Android/project/insurance-ui/src/features/support`.
Target: `packages/support`, public `@iap/api-types` contracts and iap-admin shell/route integration in the existing `codex/support-reference-parity` worktree.

## Coverage and result

| Area | Actual inspected coverage | Result |
| --- | --- | --- |
| Files/components | All 36 Support implementation files, including all 24 TSX component files; all 35 declared public/private React function names | Source names preserved. Architecture changes to provider/store/query/schema ownership documented, with no omitted source component. |
| Flow/context/mapping | Source store, context route patterns, options/types, buttons/provider/widget | Normalized store and raw context runtime equal. LIST/TEXT mapping and source fallbacks preserved. Target canonical-path integration corrected below. |
| Window/rendering | Entire 16-file window implementation closure and private markdown dependency helpers | No new window-local behavioral discrepancy found; shared reference presentations retained. |
| Tickets/queries | Five component files, both hooks, source status/color maps and mounted primitives | Query keys, pagination, owner guards, ordering, scroll restore, actions and names match. Skeleton discrepancy corrected below. |
| APIs | All five service operations plus request/response boundaries and transport options | Actual-source service comparison passed for methods, paths, body/query placement, validation, credentials and cancellation. |
| Schemas | All 29 exported schemas reached from support/tickets/My-IAP source files, including nested users, histories, messages, sort/pageable fields and enum dependencies | Differential cases match acceptance, parsed output, unknown-key stripping/retention and full ordered validation issues. |
| Translations | Entire source supportFlow subtree, 47 literal translation calls and 24 status translation leaves; both application consumers | Exact Persian values match; no source-absent literal t() key found in this closure. Dynamic option field/status maps inspected. |

Component inventory and host/localization detail: [reaudit-flow-and-locales.md](reaudit-flow-and-locales.md).
Window detail: [reaudit-window.md](reaudit-window.md).
Ticket detail: [reaudit-tickets.md](reaudit-tickets.md).
API/schema detail and endpoint table: [reaudit-contracts.md](reaudit-contracts.md).

## Corrections made in this audit

1. **Login API selection on canonical paths.** The target canonicalizes `/login/`, but the unchanged reference context utility recognizes `/login` as public. A package-owned Router adapter now removes canonical trailing slashes before delegating to the source utility. Both SupportFlowWidget and SupportFlowOpenButton use it. A test mounts the actual widget under an always-slash memory Router and verifies `publicAnswer({ pageKey: 'login' })`, with no myAnswer call. Public/raw source context names and semantics remain unchanged.
2. **Ticket loading Skeleton presentation.** Reference Skeleton uses gray-200 and continues its pulse animation; the target shared default uses surface-muted and disables animation under reduced motion. Scoped ticket classes restore source gray/animation behavior, retaining source primary-foreground overrides. Shared defaults are unaffected.

No production API, schema, Persian value or component-name correction was required after the fresh comparisons.

## Deliberate boundaries and remaining differences

- My-IAP destinations remain placeholders, explicitly required by the user; this is not full page parity and does not exclude the widget's ticket views.
- Reference theme infrastructure also accepts a persisted `system` preference. The target's accepted global theme store exposes only explicit light/dark. Support matches source color selection for both supported states; this audit does not expand the application-wide theme model. The source application's configured default is light, matching the target default.
- Public workspace APIs replace reference application imports. Zod v4 loose/nullish notation preserves inspected acceptance. Components destructure props in their bodies and use cn as required by the target architecture. Strict indexed access guards handle absent rows/messages safely; valid source inputs preserve the same output.
- SupportWidget and SupportNavigationButton are additional compatibility exports for the existing iap-app consumers; canonical source component names are retained separately.

## Final integrated verification

Actual-source tests require the reference checkout. Set `INSURANCE_UI_REFERENCE_PATH` to its repository root when it is not the worktree's sibling `insurance-ui` directory.

After all corrections:

- Support package: **56 tests passed** across seven files, including actual-source component-name/locale comparisons and six host-context cases.
- Admin Support contracts/services and placeholder routing: **53 tests passed**, including 34 fresh differential tests, seven boundary tests and 12 route tests.
- Support/API-types and both application typechecks: passed.
- Scoped Support/admin feature ESLint, architecture check, formatting and git diff whitespace checks: passed.

The initial production builds were already successful. This fresh audit validates its small scoped corrections with component/contract tests and both app typechecks; it does not claim a new production build or screenshot/live-backend verification. No browser screenshot comparison or live-backend interaction was performed, so pixel identity and server availability are not asserted.
