# Shared Support integration

## Ownership and public entry points

Use only public `@iap/support` exports. The package owns widget UI, flow state,
backend transport and ticket query capabilities; backend schemas live in
`@iap/api-types`. Feature pages compose `SupportFeatureButton` or
`SupportQuestionButton` with a verified reference feature key. Do not invent
feature keys or duplicate a widget inside a page whose layout already mounts it.

Admin operations/agent/customer-user shells mount `SupportFlowWidget
position='admin'`; the auth shell mounts `SupportFlowWidget colorContext='auth'`.
Login, Register and PasswordReset supply `SupportFlowOpenButton
colorContext='auth'` through the generic optional `footerActions` prop of their
shared auth pages. Keep the Auth package independent of Support.

`SupportFlowProvider` retains the reference public name and children composition;
flow state lives in package `context/store`. Existing iap-app hosts may use
`SupportWidget` with an explicit context and `SupportNavigationButton`. The
customer shell explicitly sets `isMyIap: true`; a URL prefix is not required.

## Route and deployment adapters

Admin uses canonical trailing slashes. Its package widget/open-button adapter
normalizes the trailing slash before delegating to the source context utility,
so `/login/` remains public and selects `publicAnswer`. Keep this adaptation at
the Router boundary rather than changing the backend page-key contract.

My-IAP belongs exclusively to iap-app. Never add admin My-IAP routes or
placeholders to satisfy a Support link. Customer claim navigation uses
`/myclaims/{encoded-id}` against tenant `VITE_IAP_APP_DOMAIN_URL`; the user removed
`/myiap` from the customer pathname. Backend `/my/iap-ticket` endpoints and source
schema/component names are unaffected. Do not infer other customer URLs from
these rules; inspect their reference and current owner first.

## Contracts, localization and controls

Read `SUPPORT-REFERENCE-CONTRACT.md` for the approved source request exception.
Paginated `content` is `.nullish()` workspace-wide; consume `content ?? []` and
validate every present item. Do not reintroduce source null rejection.

Support requires the actual source `supportFlow` locale subtree plus the reached
claim/ticket status leaves in each consuming app. Keep source field/status maps
and literal fallbacks; compare Persian values instead of translating them anew.

Use the scoped `@iap/ui` reference presentations when porting source controls.
Button reference ghost classes must not inherit default dark-hover text colors.
Test default variants as well as explicit source overrides when changing a
shared primitive. Global theme currently supports explicit light/dark; system
preference is a known global difference, not a Support-local implementation.

## Verification

The current component inventory and evidence live under
`docs/tasks/support-reference-parity/final-audit.md`. Actual-source comparison
tests use `INSURANCE_UI_REFERENCE_PATH` pointing at the insurance-ui checkout.
Run focused package tests, API boundary tests and mounted auth/route tests after
changing their owners. Test schema acceptance/output/issues, query ownership,
request placement and user-visible state transitions. Mocked transport and
builds do not establish live-backend or pixel parity.
