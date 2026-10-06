# Feature architecture review checklist

Use this checklist together with [Application architecture](APPLICATION-ARCHITECTURE.md)
and the relevant repository-local skills when reviewing an existing feature.
The application architecture remains the authority for ownership rules.

## Ownership and migration

- Inspect the implementation behind exports. A correctly located barrel that
  re-exports a legacy store, schema or query does not migrate ownership.
- Keep a single-root-route feature's page at its root when appropriate. Features
  with sibling page journeys use `pages/<page>/` and page-exclusive components.
- Place schemas and domain types in `model/`; keep UI-state helpers with their
  state owner, not in the domain-contract directory.
- Place Zustand implementations in `context/store/` and lifecycle providers in
  `context/provider/`. Keep URL state in route adapters and server state in queries.
- Move implementations, consumers, mocks and colocated tests together; remove
  obsolete re-export wrappers after checking all consumers.
- Use configured absolute application imports and deliberate package public APIs.

## Component and data boundaries

- Extract focused header actions and form field groups when they clarify ownership.
  Keep form conversion helpers near their form and avoid mechanical directories.
- Read component props inside the body and use narrow store selectors.
- Memoize translated schema factories with their translation dependency.
- Centralize repeated query definitions while preserving verified cache keys,
  enabled conditions, cancellation and lookup behavior.
- Keep mutation hooks in queries. Use the global error handler for standard
  failures; keep feature-specific success and cleanup behavior explicit.
- Validate requests and responses at the service boundary using package schemas.
  Use strict request objects and validate identifiers before sending requests.
- Compose conditional classes with `cn` from `@iap/ui`. Use `isFetching` when
  refresh progress must include subsequent requests, not just initial loading.

## Verification and delivery

- Run focused behavioral tests, type checking, lint, architecture checks and build
  appropriate to the affected owners. Distinguish passed tests from planned tests.
- Configure the reference-repository path for suites that read external fixtures.
- Finish source edits before running the final suite, so cached modules cannot
  mix earlier package exports with later service imports.
- Inspect generated build changes and exclude unrelated generated route updates.
- Record verified results and remaining limitations separately from historical
  product requirements and reference-parity acceptance criteria.
