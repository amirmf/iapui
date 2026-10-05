# Feature public API boundaries

## Objective

Remove cross-feature imports of implementation files and expose deliberate,
minimal feature public APIs.

## Scope

- Replace imports such as `@features/<feature>/services/...` with imports from
  `@features/<feature>` or an owning module.
- Move a capability into `src/modules` when it is reused independently of a
  feature page and needs a stable cross-feature API.
- Keep imports within the same feature unrestricted and colocated.

## Acceptance criteria

- No feature imports another feature's `components`, `context`, `model`,
  `pages`, `queries`, or `services` implementation path.
- Every public feature export is intentional and has an owning consumer.
- The lint boundary rule prevents regressions.

## Status

Complete. The identified cross-feature implementation imports now use
deliberate feature public APIs, and the architecture check prevents new deep
imports.
