---
name: reference-page-parity
description: Compare an implemented React page with a local reference project and port only verified UI, API, schema, and translation behavior. Use for page-parity work, not for broad redesigns or undocumented feature invention.
---

# Reference Page Parity

Use this skill when a target page must match a local reference implementation.

## Establish the scope

- Identify the target page, its reference entry point, and every branch it can
  mount. Trace the direct component closure before changing code.
- Confirm the owning application (`iap-admin` or `iap-app`) from the user's
  request before editing. A reference route does not determine the target app.
- Include shared dependencies in the closure: table/pagination/sort menus,
  filters, selects, date controls, dialog compositions and their primitives.
  Being shared is not evidence of equivalent visible behavior. Inspect nested
  response schemas reached by full-detail responses, not just top-level types.
- Create a task document under `docs/tasks/`. Record source paths, concrete
  discrepancies, completion criteria, and priority. Keep task documentation
  separate from architecture documentation.
- Treat the reference as the source of truth for visible behavior, request
  contracts, schemas, and translation values. Do not invent a target behavior
  merely because an endpoint or a reference-only dependency exists.

## Implement safely

- Compare same-responsibility components file by file: loading, error, empty,
  permissions, pending controls, navigation, table state, mutation success
  sequencing, and accessibility semantics.
- Copy API names, request placement, defaults, field optionality, enums, and
  response validation from the reference. Keep target architecture boundaries:
  routes stay thin, feature internals are not imported cross-feature, and
  shared contracts belong in `@iap/api-types`.
- Extract only the reference locale keys actually used by the mounted closure.
  Verify Persian values programmatically; never translate or infer them.
- Keep focused components small. Prefer the target's approved shared primitives
  when they provide behavior equivalent to a reference-local primitive.
- When a shared primitive differs visibly, prefer its scoped
  `presentation='reference'` capability where available; do not change every
  consumer's default styling. Read
  `docs/architecture/REFERENCE-PAGE-CONTROLS.md` for current APIs and pitfalls.
- Record source-absent translation keys and their literal fallbacks. A matching
  global target key must not silently replace a fallback actually shown by the
  source page. Keep enum translation maps centralized and preserve distinct
  creation/filter subsets and their order.

## Verify and record completion

- Add focused tests for contracts, URL state, and user-visible behavior. Include
  invalid schema cases and request method/path/body/query placement.
- Before checking a task, run the affected tests plus typecheck, lint, and
  `git diff --check`. Mark the task complete only when its stated evidence is
  verified; update any stale status prose in the same document.
- If a required reference capability is absent in the target, port the minimal
  source-backed capability when it is in page scope. Otherwise document the
  exact evidence and ask for direction rather than claiming parity.
- Verify pending debounce cancellation on clear/reset/unmount, absent selected
  lookup options, mutation failure keeping confirmations open, and success
  sequencing without accidentally awaiting source-non-awaited invalidation.
- On a fresh audit, mark earlier task documents historical and point them at
  the newest evidence. Distinguish file/contract tests from actual browser
  screenshot and live-backend verification; never use passed tests alone to
  claim pixel-identical rendering.

## Contract precedence and integration

- Paginated response `content` is always nullish under the accepted workspace
  architecture. Use `.nullish()` even when the reference rejects null or missing
  content. Validate present array items and consume `content ?? []` safely.
  This accepted exception does not require another approval. Request pagination
  defaults and unknown-key handling remain separate decisions.

- If a reference contract conflicts with an accepted architecture convention,
  ask which semantics take precedence before changing validation. Record an
  explicitly authorized exception with its page scope; do not extend it to other
  domains. Architecture ownership and public import boundaries still apply.
- Compare schema acceptance, stripped/retained output, canonical export names
  and validation issue order, including nested schemas and null/empty values.
  Shared factories are reusable only when their behavior matches the decision.
- Trace presentation through every mounted dependency, including tooltips,
  popovers, calendar CSS and date fields inside shared confirmations. Forward
  the host language and source clear behavior at each boundary.
- During integration with a newer main branch, inspect existing public
  capabilities before adding another equivalent primitive. Reconcile shared
  changes without replacing the other page's accepted behavior. Run affected
  consumers and shared-package tests against the integrated tree, and record
  which final edits were covered by each verification run.
- Resolve source-only dependency values inside the scoped component rather than
  at module initialization when default consumers should not evaluate them.
  Test unchanged defaults as well as reference presentation.
- Compare URL transitions as well as parsed defaults: controls may write only
  their own parameters, and sorting may initialize once instead of tracking
  later URL changes. Compare committed and unpublished debounced selections.
- Exercise actual form adapters for clearing and dirty-field submission;
  mocked date/select primitives can hide integration differences. Distinguish
  a proven reference divergence from behavior shared with the reference.
- In shared schema factories, type translation callbacks by the keys they
  accept instead of importing application-augmented i18next types. Verify all
  consuming applications: their locale type augmentations can differ.

## Shared Support integration

When a reference page mounts Support actions, read
`docs/architecture/SUPPORT-INTEGRATION.md` and its scoped contract record. Reuse
public `@iap/support` actions with verified source feature keys; do not mount
another widget inside a page already covered by its layout. Compare mobile auth
entry points as well as the floating desktop control. Normalize canonical paths
at the Router boundary before selecting public/private Support transport.

My-IAP pages belong only to iap-app. Customer claim links use the configured
customer application origin and `/myclaims/{encoded-id}` without `/myiap`;
backend `/my/iap-ticket` paths remain unchanged. Reuse tenant deployment
configuration instead of inventing a URL or adding an admin compatibility route.

## Small form parity lessons

- Compare mounted primitives and global styles as well as feature JSX. Identical
  Tailwind classes can render differently because of base border/outline tokens,
  mobile input rules, font-provider selectors and autofill declarations.
- Verify the actual active font declaration and registered font-face names; do
  not silently correct a source fallback while claiming exact visual parity.
- Shared Card title/description support `as='div'`; TabsTrigger and
  TextField/FormMessage support `presentation='reference'`. Use these only for
  verified source semantics and test unchanged default consumers too.
- Field-group components returning fragments do not add DOM wrappers. Compare
  rendered field order and sibling spacing rather than assuming extraction
  changes a form's layout.
- Trace mutation failures through global handling and transport guards. A page
  can match its success flow yet differ on forced-password cancellation,
  fallback literals, HTTP 304 feedback or error extraction. Use scoped mutation
  metadata instead of duplicate feature-level toast handlers.
- Compare complete Zod issue arrays for simultaneous invalid values, not merely
  the presence of one expected message. Keep source-derived fixture evidence
  separate from screenshots and live-backend verification.
- A shared layout can introduce nested main landmarks or extra padding around
  an otherwise identical page. Scope source host corrections to the page while
  preserving approved panel ownership and other routes' presentation.
