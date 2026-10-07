> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Flow and host integration

Historical implementation evidence. The fresh complete audit and final integrated results are in [reaudit.md](reaudit.md).

Status: implemented; integrated verification is recorded in `verification.md`.

| Unit | Inspected source | Target ownership | Acceptance |
| --- | --- | --- | --- |
| F1 | `utils/support-flow-context.ts` and tests | package model/context helper | exact route patterns, opaque IDs, UUID/numeric normalization, public/My-IAP flags |
| F2 | `components/support-flow-types.ts` | `model/support-flow-types.ts` plus component-private mapping helpers | source LIST/TEXT handling and canonical names |
| F3 | `store/support-flow-store.ts` and tests | `context/store/support-flow-store.ts` | history, failure rollback, flowVersion stale-response suppression, initial availability, feature parallel requests, pagination merging |
| F4 | `icon-bot.tsx`, `support-floating-button.tsx` | package components | source SVG, responsive position and theme colors |
| F5 | `support-flow-open-button.tsx`, `support-feature-button.tsx`, `support-question-button.tsx` | package components | source labels, action composition and conditional availability |
| F6 | `support-flow-provider.tsx`, `support-flow-widget.tsx` | provider and components | no-op provider, memoized pathname context, exact reset lifecycle; keep old consumer exports compatible |
| F7 | source authenticated/agent/customer-user/auth layouts | admin shared shell composition | mount one widget per layout, source admin position, mobile entry; no full My-IAP pages |
| F8 | mounted translation calls and reference Persian locale | host locales | copy verified values; retain literal source fallback where key absent |

Read architecture, reference-page-parity, ui-ux-pro-max, component-props-in-body, zustand and vercel-react-best-practices. UI guidance search `keyboard focus dialog` verified visible focus guidance; source presentation takes precedence over redesign.

## Verified integration additions

- Source `components/layout/authenticated-layout.tsx`, `agent-layout.tsx`, `customer-user-layout.tsx` mount `SupportFlowWidget position='admin'`; admin shells now compose that public export.
- Source `components/layout/auth-layout.tsx` mounts auth-colored widget; target `shared/app-shell/auth-layout.tsx` owns that composition with a thin `_auth` route.
- Source login `features/auth/login/index.tsx` places `SupportFlowOpenButton colorContext='auth'` in its footer. Target LoginPage exposes a generic optional `footerActions` slot to avoid a support/auth package cycle; admin composes the source button there. Existing callers omit the slot.
- No extra mobile admin header button is added: the inspected source only mounts the mobile open button in the login footer. The public button remains available for source-backed future composition.
- Source tenant `myIapNavigation.background` and `backgroundDark` values are copied from matching alborz/dana reference brand files and emitted by the existing tenant preparation owner. No unrelated source environment values copied.
- Source status translation leaf keys are copied from `src/locales/fa.json` alongside the entire mounted `supportFlow` subtree. Both host locales carry the shared package keys.
- User explicitly limited My-IAP page implementation to placeholders. `/myiap/` and `/myiap/$` resolve to the existing generic PlaceholderPage through a feature public component; no My-IAP business journey implemented. The splat covers source/server-provided links without inventing full page contracts.

Shared controls use source presentation for Buttons, Textarea, ticket Badges and TooltipContent. The question tooltip gets its own zero-delay provider as in the reference; other consumers retain their defaults.
