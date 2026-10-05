# Architecture boundary enforcement

## Objective

Make the workspace automatically reject dependency directions and legacy
application folders that contradict `APPLICATION-ARCHITECTURE.md`.

## Scope

- Add repository-owned ESLint rules for the two applications.
- Prevent cross-feature deep imports; a feature consumer may import only the
  target feature's public `index.ts` API.
- Prevent modules from importing features and workspace packages from importing
  application code.
- Reject new application `ui/`, `model/store/`, and `model/context/` imports.

## Acceptance criteria

- `pnpm lint` fails for each prohibited import direction.
- Existing migration work can use the canonical `components/` and `context/`
  locations without lint exceptions.
- The rules have focused tests or representative fixtures.

## Status

Complete. `tools/check-architecture.mjs` checks the documented folder and
dependency boundaries, and the root lint command includes it as a required
validation gate.
