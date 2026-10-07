# Final flow and host integration audit

Date: 2026-10-07. Reference: the actual local insurance-ui checkout. Target: the
existing support-reference-parity worktree.

## Complete inspected closure

| Source owner under `src/features/support` | Target owner | Evidence |
| --- | --- | --- |
| `store/support-flow-store.ts` | `context/store/support-flow-store.ts` | After removing imports and transpiling TypeScript, runtime token streams are identical. All initial/reset/feature/select/text/back/pagination actions, stale-version guards and failure rollback were inspected. |
| `utils/support-flow-context.ts` | `model/support-flow-context.ts` | Runtime token streams are identical. Static-before-dynamic patterns, opaque/UUID/numeric segments, page keys and public/My-IAP flags remain source-based. |
| `components/support-flow-types.ts` | `model/support-flow-types.ts` and component helper compatibility entry | All declarations retained; runtime mapping/message/input helper token streams are identical. Nullish option content is consumed as an empty collection. |
| `components/icon-bot.tsx` | Same relative path | Runtime token streams identical, including full SVG path and forwarded props. |
| `components/support-flow-provider.tsx` | `context/provider/support-flow-provider.tsx` | Same named no-op children composition; props destructured in body. |
| `components/support-flow-widget.tsx` | Same relative path | Same props/defaults, memoized route context, reset effect, availability gate, floating button and window. Target canonical trailing slashes are adapted at the package route boundary. |
| `components/support-flow-open-button.tsx` | Same relative path | Same auth/default variants, mobile-only class, icon, labels, visibility and open action; canonical paths use the same route adapter. |
| `components/support-floating-button.tsx` | Same relative path | Same default/admin positions, open suppression, translated labels, decorative spans, theme-dependent tenant background and auth color behavior. |
| `components/support-feature-button.tsx` | Same relative path | Same availability gate, feature action, optional icon-only content, forwarded button props and configured theme background. Explicit link text token compensates for target primitive's default link styling. |
| `components/support-question-button.tsx` | Same relative path | Same split primary/help actions, shared disable state, source labels and rounded edges; local zero-delay tooltip provider preserves source timing. |
| `hooks/use-element-size.ts` | Same relative path | Runtime token streams identical; measurements, ResizeObserver setup and cleanup unchanged. |

Runtime comparisons ignore imports/comments and TypeScript-only declarations;
they compare transpiled tokens rather than treating formatting changes as logic.
Widget/button adaptations were manually compared with mounted public primitives.
Additional SupportWidget/SupportNavigationButton exports retain existing iap-app
consumer APIs; they do not replace any source component name.

## Host integration correction

The source RegisterShell and PasswordResetShell each mount
`SupportFlowOpenButton colorContext='auth'` in their footer. Admin previously
supplied that mobile entry only on Login. The register and password-reset hosts
now compose the same Support button through the optional `footerActions` slot.
The slot is defined in shared AuthPageProps and rendered by all three password
auth pages. Authentication does not import Support; the application owns that
composition. The optional slot leaves other consumers' rendered footer intact.

A mounted test renders the real admin Register and PasswordReset hosts, shared
auth pages and SupportFlowOpenButton under an always-slash memory Router. It
verifies both mobile buttons open Support with the correct public page context.
The existing mounted Login widget test separately verifies publicAnswer selection.

Operations, agent and customer-user layouts each mount one admin-position widget;
auth layout mounts the auth-color widget. Source admin header contains no active
Support button, so none was invented. No admin My-IAP route exists. The iap-app
shell explicitly supplies isMyIap=true without requiring a URL prefix.

## Accepted differences and limits

The established global theme supports explicit light/dark; source theme also
accepts system preference. Support colors match the supported states. No global
theme expansion was included. The user-approved nullish content contract and
customer claim URL adaptation are recorded in the combined report. Inspection
and mounted/unit tests do not prove visual or live-backend parity.
