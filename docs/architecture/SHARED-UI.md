# Shared UI primitives

## Decision

`@iap/ui` owns presentational primitives that are shared by the `iap-app` app
and `iap-admin` admin application. It must not depend on either application's
features, configuration, or localization runtime.

`@iap/forms` owns React Hook Form adapters for these primitives. It connects
form state, field registration, labels, descriptions, errors, and focus
behavior without changing the UI primitive's controlled API.

## Dialog compositions

`@iap/dialogs` owns reusable dialog compositions built from `@iap/ui`
primitives. It contains common confirmation variants and the soft/hard-delete
selection flow. These components may use the host application's i18next
runtime, but do not own translation resources: the applications continue to
own their Persian `common` namespace entries.

Dialog compositions must remain independent of application services, query
keys, toasts, routing, and feature stores. The owning feature supplies an
operation callback and handles invalidation or feature-specific feedback.

Cross-application dialogs that require authentication contracts belong in
`@iap/auth`, alongside their Zod API contracts and services. The forced
password-change and audit-information dialogs follow this rule. A dialog that
is meaningful only to one product journey remains colocated in that feature.

## Date picker contract

The shared date picker API consists of two controlled primitives:

- `DatePicker` accepts one `Date | undefined` value and supports `date` and
  `date-time` modes.
- `DateRangePicker` accepts one `{ from?: Date; to?: Date }` value and uses
  the same modes.

Both primitives receive `locale`, placeholders, and accessible labels through
props. They do not import `react-i18next`; each application supplies localized
values through its own i18n boundary.

`DatePickerField` and `DateRangePickerField` are the corresponding public
`@iap/forms` adapters. Application code should use these adapters for React
Hook Form fields and use the `@iap/ui` primitives directly only outside a
React Hook Form context.

## Styling

For inspected reference-page ports, selected primitives and dialog compositions
offer opt-in `presentation='reference'`. See
[Reference-page controls](REFERENCE-PAGE-CONTROLS.md) for supported APIs and
behavioral boundaries. Default presentation remains unchanged for other pages.

Styles required by a shared primitive are colocated with that primitive in
`@iap/ui`. Application-global document rules remain in the owning
application's `src/styles` entry point.

## Conditional visibility

`@iap/ui` provides the `Permission` component for conditionally rendering UI.
It renders its children when `hasPermission` is `true`; otherwise it renders
nothing. Despite its name, the component is deliberately independent of
authentication, roles, policies, and feature state. The calling component owns
the condition and passes its resolved boolean to `Permission`.

Use `Permission` instead of inline conditional rendering when a condition
controls whether a component or a group of related components is visible. This
keeps JSX focused on the visible UI and makes the visibility rule easy to find.

```tsx
import { Button, Permission } from '@iap/ui'

<Permission hasPermission={canEditClaimRequest}>
  <Button onClick={openEditDialog}>Edit claim request</Button>
</Permission>
```

For unrelated conditions or when a branch must render an alternative UI, use
normal conditional rendering. `Permission` is only a presentation helper and
does not replace backend authorization or route access control.

## Table primitives

`@iap/ui` provides semantic table markup only: `Table`, `TableHeader`,
`TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, and
`TableCaption`. These primitives have no TanStack Table, route, request, or
product-state dependency.
