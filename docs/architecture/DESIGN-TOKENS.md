# Design tokens

## Decision

`@iap/design-tokens` is the single source of truth for color tokens and shared
visual foundation tokens used by the `iap-app` app and `iap-admin` admin
application. Its initial palette and radius token are migrated from the legacy
`insurance-ui` application.

The package exposes:

- `@iap/design-tokens/theme.css` for the light and dark CSS custom properties.
- `@iap/design-tokens` for the supported token-name and theme-class TypeScript
  contract.

`@iap/tailwind-config/preset` maps the approved CSS variables to Tailwind
utilities, including the base, primary, secondary, and gray color scales.

## Conventions

- Applications import `@iap/design-tokens/theme.css` once from their entry
  point. They must not copy shared color declarations into application styles.
- Components use semantic Tailwind utilities such as `bg-primary`,
  `text-foreground`, and `border-border` by default. Palette utilities such as
  `bg-primary-600` are reserved for intentional visual choices.
- New shared colors are added to the token package and its Tailwind preset in
  the same change. Application-local colors remain in the owning application.
- Token values use comma-separated RGB channels so Tailwind opacity modifiers
  remain available, for example `bg-primary/50`.
- Shared document-level rules stay in each application's `src/styles` entry.
  Styles for a presentational primitive are colocated with that primitive in
  `@iap/ui`; feature and application-layout styles stay with their owner.

## Theme behavior

The default theme is light. Adding the `dark` class to an ancestor switches
semantic tokens to their dark values. Palette scales remain stable across theme
classes, while semantic tokens provide accessible foreground, action, and
surface pairings for each theme.
