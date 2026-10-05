# Application architecture

## Purpose

This document defines the baseline frontend workspace, module boundaries, dependency rules, and code-placement rules for `iap-ui`. Product scope and implementation are intentionally deferred.

## System boundary

This repository contains frontend applications only:

- **iap-app (app)**: the customer-facing application, implemented with React and Vite.
- **iap-admin (admin)**: the internal operations application, implemented with React and Vite.
- **Backend**: an independent service that owns authorization, business enforcement, and all third-party integrations.

Both frontend applications consume backend APIs. They must not connect directly to third-party business systems, payment providers, or identity/OTP providers.

Tenant selection is build-time configuration. `TENANT` selects a descriptor in
`tenants/<tenant>/`; the tenant preparation tool generates each application's
public API and login-brand environment values before development or production
builds. Tenant descriptors also own metadata translation keys; the preparation
tool resolves those keys from the tenant's Persian locale and injects the
resulting document metadata into both applications at build time.

## Workspace shape

```text
iap-ui/
├── apps/
│   ├── iap-app/                   # React + Vite app
│   │   └── src/
│   │       ├── app/               # thin TanStack Router boundary
│   │       ├── features/
│   │       ├── modules/
│   │       ├── shared/
│   │       └── styles/
│   └── iap-admin/                 # React + Vite admin
│       └── src/
│           ├── app/               # thin TanStack Router boundary
│           ├── features/
│           ├── modules/
│           ├── shared/
│           └── styles/
├── packages/
│   ├── ui/
│   ├── forms/
│   ├── shared-lib/
│   ├── api-client/
│   ├── api-types/
│   ├── design-tokens/
│   ├── tailwind-config/
│   ├── eslint-config/
│   └── typescript-config/
├── docs/architecture/
└── tools/
```

`pnpm` owns this monorepo. The applications remain independently deployable and may share only focused packages with public APIs.

## Application ownership

### `src/app`

`src/app` is exclusively a routing and composition boundary. It must not own product behavior, reusable components, providers, utilities, or feature folders.

When implementation begins:

- Both applications use TanStack Router file-based routes. Route files remain thin and compose public exports from other owners. Generated route trees are not edited manually.
- Each navigable web-page URL has a dedicated directory for its static page
  segments in `src/app/router/routes`; the directory's `index.tsx` is the
  file-route entry. For example, `/doc-types` and `/doc-types/create` are
  represented by `doc-types/index.tsx` and `doc-types/create/index.tsx`.
  Dynamic parameters are data, not pages: do not create a directory solely for
  `$docTypeId`. Preserve the URL with a flat TanStack file route such as
  `doc-types/$docTypeId.edit.tsx`. This convention keeps page ownership and
  route-local configuration readable without introducing parameter-only
  directories.
- A route directory is a routing boundary only. Its entry may contain route
  configuration such as validation, loaders, and a composition import, but it
  must not contain page business behavior, UI components, state, API calls, or
  feature utilities. Those remain in the route's owner under `features` (or in
  `modules` / `shared` when the existing ownership rules apply). A feature may
  use a matching page directory for page-specific UI when that improves
  discoverability; it must not duplicate reusable route logic.

### `src/features`

Owns product- and screen-specific behavior. Folders should mirror stable customer or admin journeys. A feature may contain `components`, `model`, `context`, `services`, `queries`, and a public `index.ts` as needed.

Within application source (`features`, `modules`, and `shared`) and workspace
packages, React components belong in a `components/` directory. Do not
introduce or retain a `ui/` directory for that purpose. The `@iap/ui` package
is an intentional exception: its name identifies the workspace's shared
presentational-primitives package, rather than an application folder
convention.

Every navigable page owned by a feature normally has a matching directory under
that feature's `pages/` directory. The directory mirrors the static page kind
below the feature root and contains the page component: `pages/index/` for the
feature root URL, `pages/create/` for `/create`, and `pages/edit/` for a page
such as `/$entityId/edit`. Dynamic identifiers are route input and must not
create a `$entityId` feature directory. This gives each URL one clear feature
owner without moving behavior into `src/app`.

For a feature that owns only its root route and has no sibling page journeys,
the page component may live directly in the feature root and its page-exclusive
component groups may live under `components/`. This avoids a redundant
`pages/index/` wrapper while retaining the same ownership boundary. If a second
page journey is introduced later, move the root page and its exclusive
components into the corresponding `pages/` directories. Code shared only by
sibling page directories belongs in the nearest `shared/` directory; reusable
capability must still follow the normal `modules` or application-wide `shared`
ownership rules.

Do not create a directory for every component mechanically. Keep a small,
single-file page component next to its peers when no further categorization is
needed. Create a lowercase-kebab-case component directory only when it owns
colocated tests, hooks, styles, private helpers, or a group of smaller related
components and the directory makes that group easier to navigate. A
page-exclusive component or component group belongs under
`pages/<page>/components/` (or under the root `components/` group for the
single-root-route exception); a component reused by multiple pages of the
feature belongs under the feature's `components/`. Do not create a feature-wide
`components/` dumping ground: a component owned by one page remains under that
page's `components/` directory.

### Feature model and context

`model/` is a data-contract boundary. It contains only the feature's business
models and validation contracts: domain types, value objects, enums, and Zod
schemas (including form schemas when the schema is feature-specific). It must
not contain React components, providers, hooks that manage state, Zustand
stores, or Context definitions.

Feature-local client-state coordination belongs under `context/`. In this
architecture, `context/` is a feature-structure name: it includes both Zustand
stores and React Context implementations, and is not limited to React's
`createContext` API.

```text
features/<feature>/
├── components/                  # feature-reusable React components
├── model/                       # models, types, enums, and Zod schemas only
├── context/
│   ├── store/                   # Zustand stores
│   └── provider/                # React contexts and their providers
├── queries/                     # TanStack Query definitions
└── services/                    # backend-facing feature services
```

- `context/store/` owns Zustand stores for feature-scoped client UI state shared
  by multiple feature components, such as selection, dialog state, and
  temporary local workflows. It must not hold server state, API results, or
  route state.
- `context/provider/` owns a React context together with its provider when state
  or actions must be shared across deeply nested or separately composed feature
  UI. Do not create a context merely to avoid a direct, meaningful prop.
- Keep provider files that own feature state in `context/provider/`, not in
  `components/` or a page directory. Providers that only compose application-
  wide technical integrations (for example, Query Client or authentication
  session composition) remain in `shared/providers/`.
- Do not create empty `context/`, `store/`, or `provider/` folders preemptively.
  Create each folder when it has an owning implementation, and keep it
  feature-local unless a reusable application capability genuinely emerges.
- New code must use these locations. Existing `ui/`, `model/store/`,
  `model/context/`, and colocated state-provider folders are legacy layout and
  should be moved to the target location when their owning feature is changed;
  a migration must update all affected imports and tests in the same change.

`queries/` owns TanStack Query definitions and feature-local adapters that
translate route or table controls into query inputs and API filters. These
adapters are client control logic, not domain models, and therefore must not
be placed in `model/`.

The same ownership vocabulary applies inside workspace packages: package-level
models and schemas use `model/`, reusable React components use `components/`,
and package-owned client state uses `context/store/` or `context/provider/`.
React Context instances that are purely private implementation detail of one
reusable component may remain colocated with that component.

Use `services/` for backend-facing feature or package services. Service files use the
`<domain>-service.ts` naming convention, for example `auth-service.ts`.

### `src/modules`

Owns reusable business capabilities inside one application, independent of a particular feature. A module exposes a public `index.ts`; other features and modules must not import its internals.

### `src/shared`

Owns application-wide technical infrastructure and non-business UI composition:
app shell, technical providers, configuration, localization, theme, and
application-local utilities. Application-wide React components use
`shared/components/`; application-wide client-state coordination uses
`shared/context/` with the same `store/` and `provider/` split as features. It
is not a
cross-application dumping ground.

### `src/styles`

Owns one global Sass entry point (`index.scss`) and genuinely document-level styles. Feature- and component-specific styles remain colocated with their owner as CSS/Sass modules. Shared design tokens are owned by `@iap/design-tokens`.

## Shared packages

| Package | Ownership |
| --- | --- |
| `@iap/ui` | Presentational React primitives shared by applications. |
| `@iap/forms` | Form composition and field adapters built on the shared UI contract. |
| `@iap/shared-lib` | Framework-independent utilities, date/number formatting, and common types. |
| `@iap/api-client` | HTTP client configuration, interceptors, and transport helpers. |
| `@iap/api-types` | Backend contract types and generated API types when introduced. |
| `@iap/design-tokens` | Semantic design tokens and theme CSS. |
| `@iap/theme` | Shared light/dark theme state, persistence, and icon-only switcher. |
| `@iap/panel-switcher` | Shared panel-selection presentation for cross-application navigation. |
| `@iap/support` | Shared support-flow UI and client capability. |
| `@iap/tailwind-config` | Shared Tailwind preset and plugin configuration. |
| `@iap/eslint-config` | Shared lint presets. |
| `@iap/typescript-config` | Shared TypeScript base configurations. |

Packages expose only deliberate public entry points. Applications never reach into another package's source directory.

### API contract package organization

Domain contracts in `@iap/api-types` use a directory entry point, even when a
domain initially needs only one source file. For example,
`packages/api-types/src/dashboard/index.ts` owns the Dashboard public contract
surface and is re-exported from `packages/api-types/src/index.ts`.

This convention keeps a domain's future request, response, and shared schema
files colocated without turning `src/` into a flat list. Consumers continue to
import only from the package public API; they must not import a domain's
internal files directly.

### Filterable API query parameters

The backend filtering query-parameter contract is application-independent and
lives in `@iap/shared-lib`. Every filterable API service uses
`transformApiFilterParams` to serialize array values with the `__in` suffix and
to serialize the API filters it receives. Services must not remove, interpret,
or otherwise depend on UI-only state or query parameters (for example, an
active report tab, pagination control state, or expanded-filter state).

The owning feature removes UI-only state and adapts UI controls before invoking
the service. UI-specific adapters, such as table-control range-key mapping,
remain in the owning application and must not redefine the transport contract.

## Dependency rules

```text
apps → features/modules/shared → workspace packages
features ↔ modules (through public APIs only)
workspace packages → no application imports
```

- Features may use modules, shared code, and packages.
- Modules may use shared code and packages, but must not depend on a specific feature.
- `shared` must not contain product-specific business behavior.
- `ui`, `forms`, and the remaining packages must not import application code.
- Use absolute imports for application source code. Use the configured aliases
  (for example, `@shared/tables` or `@/features/...`) rather than relative
  paths such as `../../shared/tables`, including between files in the same
  module.
- Backend contracts live in `api-types`; transport behavior lives in `api-client`.
- Every backend endpoint contract must expose Zod v4 schemas for both its request
  and response in `api-types`. API services validate outgoing requests and
  incoming responses with those schemas; TypeScript types are inferred from the
  schemas rather than authored separately.
- Use the Zod v4 public API (`z` from `zod`) for all schemas. Define strict
  request-object schemas, use `z.coerce` only where transport input needs
  coercion, validate at the API boundary with `parse`, and export types with
  `z.infer` (or `z.input` where a schema transforms input). Do not introduce
  Zod v3 APIs, compatibility helpers, or hand-authored contract types.
- When backend responses must retain unknown properties, use Zod v4's
  `.loose()` object mode. Never use the deprecated `.passthrough()` API.
- For a response field that accepts both `null` and `undefined`, use Zod v4's
  `.nullish()` rather than chaining `.nullable().optional()` (or redundantly
  chaining `.optional()` after `.nullish()`).
- General-purpose API contract schemas live in `@iap/api-types/src/common/`.
  Paginated backend responses use its `createPageResponseSchema` factory. Pass
  only the content-item schema; `content` remains required, while pagination
  metadata is nullable and optional to tolerate incomplete backend metadata
  without weakening item validation.
- Filterable paginated request contracts use `createPageRequestSchema` from
  `@iap/api-types/src/common/`. Its `filters` field uses the shared
  `pageFiltersSchema` from `@iap/shared-lib`, which is also the input contract
  for `transformApiFilterParams`; `direction` and `sort` belong to that filter
  contract. Do not redefine these fields in individual feature services.

## State, forms, and UI conventions

- Keep server state in a query layer and local UI state close to its owner.
- Use `context/store/` only for client state that needs Zustand. Use
  `context/provider/` only when React Context's tree-scoped sharing is appropriate;
  neither is a replacement for TanStack Query's server-state cache.
- Standard mutation failures are reported through the global TanStack Query
  error handler and `toastError`. Do not add a mutation-level `onError` only
  to display an error; reserve it for behavior that is specific to that
  mutation, such as rollback, targeted field errors, session cleanup, or
  navigation.
- Use schemas as the canonical validation contract for forms.
- Use `@iap/ui` primitives before creating application-specific duplicates.
- Build conditional CSS classes with the public `cn` helper from `@iap/ui`.

## Naming and tests

- Use lowercase kebab-case for folders, PascalCase for React components, and explicit public `index.ts` files.
- Place focused tests beside the owner or in its local `test/` folder.
- Keep browser application tests separate from package tests.

## Current implementation baseline

Both applications provide a Vite/React bootstrap, route composition, application
providers, API-client configuration, localization, and implemented product
features. New code must preserve the ownership and dependency rules in this
document; `pnpm lint` includes the architecture-boundary check that enforces
the most important folder and import constraints.
