# Localization

## Decision

The `iap-app` storefront and `iap-admin` application are Persian-only (`fa`)
and render right-to-left content.

Each application owns its own i18next configuration and translation resources:

- `apps/iap-app/src/shared/i18n/locales/fa/`
- `apps/iap-admin/src/shared/i18n/locales/fa/`

Translation resources are stored in the repository. The applications do not use
Locize, a translation CDN, or a shared workspace localization package.

## Rationale

The two applications are independently deployable and have separate product
vocabularies. Keeping their resources local preserves that boundary while
allowing either application to add namespaces as its feature set grows.

## Conventions

- The default and fallback language is `fa`.
- `common` is the initial namespace for each application.
- Application code uses the local `useTranslate` helper from
  `src/shared/i18n` rather than importing `react-i18next` directly.
- New user-facing strings are added through the i18next extraction workflow
  and translated in the owning application's `fa` resources.
