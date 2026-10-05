# Feature layout migration

## Objective

Bring every application feature in line with the canonical layout:
`components/` for React UI, `model/` for models and schemas, and `context/`
for local client-state coordination.

## Scope

- Rename all feature, application, and workspace-package `ui/` directories to
  `components/`, except the intentional `@iap/ui` package name.
- Move Zustand stores to `context/store/`.
- Move React Context definitions and state-owning providers to
  `context/provider/`.
- Keep page-private components and state under their owning `pages/<page>/`
  boundary when they are not shared by another page of the feature.
- Reclassify non-schema table, filter, and route-state adapters out of `model/`.

## Migration order

1. `iap-admin/user-account` as the reference migration.
2. Other features that use a root `ui/` directory.
3. Features with `model/store/` or state-owning providers.
4. Application-wide `shared/ui` and client-state owners.

## Acceptance criteria

- No application source has a `ui/`, `model/store/`, or `model/context/`
  directory.
- `model/` contains only models, types, enums, and validation schemas.
- All imports and colocated tests resolve after every feature migration.
- Each migrated feature passes its focused tests, typecheck, and lint.

## Status

Complete. Application and workspace-package components use `components/`,
except for the intentional `@iap/ui` package name. Client state uses the
`context/store/` and `context/provider/` boundaries, while table/route-control
adapters use `queries/` rather than `model/`.
