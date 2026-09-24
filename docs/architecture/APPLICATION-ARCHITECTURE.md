# Application architecture

## Purpose

This document defines the baseline frontend workspace, module boundaries, dependency rules, and code-placement rules for `iap-ui`. Product scope and implementation are intentionally deferred.

## System boundary

This repository contains frontend applications only:

- **iap-app (app)**: the customer-facing application, implemented with React and Vite.
- **iap-admin (admin)**: the internal operations application, implemented with React and Vite.
- **Backend**: an independent service that owns authorization, business enforcement, and all third-party integrations.

Both frontend applications consume backend APIs. They must not connect directly to third-party business systems, payment providers, or identity/OTP providers.

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

### `src/features`

Owns product- and screen-specific behavior. Folders should mirror stable customer or admin journeys. A feature may contain `api`, `model`, `queries`, `schemas`, `ui`, and a public `index.ts` as needed.

### `src/modules`

Owns reusable business capabilities inside one application, independent of a particular feature. A module exposes a public `index.ts`; other features and modules must not import its internals.

### `src/shared`

Owns application-wide technical infrastructure and non-business UI composition: app shell, providers, configuration, localization, theme, and application-local utilities. It is not a cross-application dumping ground.

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
| `@iap/tailwind-config` | Shared Tailwind preset and plugin configuration. |
| `@iap/eslint-config` | Shared lint presets. |
| `@iap/typescript-config` | Shared TypeScript base configurations. |

Packages expose only deliberate public entry points. Applications never reach into another package's source directory.

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
- Backend contracts live in `api-types`; transport behavior lives in `api-client`.

## State, forms, and UI conventions

- Keep server state in a query layer and local UI state close to its owner.
- Use schemas as the canonical validation contract for forms.
- Use `@iap/ui` primitives before creating application-specific duplicates.
- Build conditional CSS classes with the public `cn` helper from `@iap/ui`.

## Naming and tests

- Use lowercase kebab-case for folders, PascalCase for React components, and explicit public `index.ts` files.
- Place focused tests beside the owner or in its local `test/` folder.
- Keep browser application tests separate from package tests.

## Initial state

Both applications include a minimal Vite/React bootstrap, a root route, and an empty index route. Product features, application providers, API clients, and ADR documents are added only in response to an explicit implementation request.
