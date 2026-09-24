# Shared UI primitives

## Decision

`@iap/ui` owns presentational primitives that are shared by the `iap-app` app
and `iap-admin` admin application. It must not depend on either application's
features, configuration, or localization runtime.

`@iap/forms` owns React Hook Form adapters for these primitives. It connects
form state, field registration, labels, descriptions, errors, and focus
behavior without changing the UI primitive's controlled API.

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

Styles required by a shared primitive are colocated with that primitive in
`@iap/ui`. Application-global document rules remain in the owning
application's `src/styles` entry point.
