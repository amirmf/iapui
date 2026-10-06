---
name: reference-page-parity
description: Compare an implemented React page with a local reference project and port only verified UI, API, schema, and translation behavior. Use for page-parity work, not for broad redesigns or undocumented feature invention.
---

# Reference Page Parity

Use this skill when a target page must match a local reference implementation.

## Establish the scope

- Identify the target page, its reference entry point, and every branch it can
  mount. Trace the direct component closure before changing code.
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

## Verify and record completion

- Add focused tests for contracts, URL state, and user-visible behavior. Include
  invalid schema cases and request method/path/body/query placement.
- Before checking a task, run the affected tests plus typecheck, lint, and
  `git diff --check`. Mark the task complete only when its stated evidence is
  verified; update any stale status prose in the same document.
- If a required reference capability is absent in the target, port the minimal
  source-backed capability when it is in page scope. Otherwise document the
  exact evidence and ask for direction rather than claiming parity.

## Contract precedence and integration

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
