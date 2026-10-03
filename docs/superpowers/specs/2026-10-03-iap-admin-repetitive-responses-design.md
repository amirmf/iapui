# Repetitive responses page design

## Intent and success criteria

Implement `/repetitive-responses/` in `iap-admin` with the same verified
behavior, Persian text, request contracts, and interaction model as the local
`insurance-ui` reference page. The implementation must follow the `iap-ui`
workspace architecture: routes are composition-only, business behavior is
feature-owned, API schemas are public `@iap/api-types` contracts, and shared
primitives are consumed rather than duplicated.

Success means an authorized administrator can manage response groups and
repetitive responses, filter and refresh each table, select rows for the
reference delete flow, and create, edit, view, and delete items with the same
reference API method/path/payload behavior.

## Scope and reference boundary

Reference route:

- `insurance-ui/src/routes/_authenticated/repetitive-responses/index.tsx`

Mounted reference closure:

- `features/repetitive-responses/pages/repetitive-responses-page.tsx`
- group and response services, schemas, provider/store, table sections,
  columns, filters, row actions, forms, view dialogs, and delete-method
  dialogs under `features/repetitive-responses/`
- mounted `repetitiveResponses` and `repetitiveResponseGroups` locale
  namespaces in `src/locales/fa.json`

Out of scope: unrelated navigation redesign, reference-only utilities, and
non-mounted reference capabilities. Navigation registration is included only
if the reference route is discoverable from its sidebar and the target has the
corresponding navigation boundary.

## Chosen architecture

Create `apps/iap-admin/src/features/repetitive-responses/` with these focused
owners. Every page-specific component keeps the exact source component name
and responsibility; only its directory changes to comply with the target's
feature ownership rules.

- `pages/index/`: page composition of the group table followed by the response
  table.
- `model/`: route/search state, dialog and selection store, and form schemas.
- `services/`: response and response-group transports that validate both
  outgoing payloads and responses through `@iap/api-types` schemas.
- `pages/index/components/`: the source-named page-specific components listed
  in the task document. Group and response subdirectories make ownership
  discoverable without renaming a component.
- `constants/`: enum-label mapping only if verified as used by the reference;
  it must contain no locale text duplicated from translation resources.

The thin route at
`apps/iap-admin/src/app/router/routes/_authenticated/repetitive-responses/index.tsx`
will import the feature's public page export. Public contracts for both domains
will be added under `packages/api-types/src/repetitive-responses/` and exported
only through the package public API.

TanStack Query owns server data and cache invalidation. A feature-scoped
Zustand store owns only modal state, selected rows, and current rows. URL
filter/table state uses the target shared table utilities, preserving the
reference's independent response and group behavior without passing UI-only
state into service calls.

### Source-name parity map

The route imports `RepetitiveResponsesPage`. The page composes the source-named
`RepetitiveResponseGroups` and `RepetitiveResponsesSection` components through
`RepetitiveResponseProvider`. The target ports these exact names:

- `RepetitiveResponseGroups`, `useRepetitiveResponseGroupColumns`,
  `RepetitiveResponseGroupDataTableToolbar`,
  `RepetitiveResponseGroupRowActions`, `RepetitiveResponseGroupFormDialog`,
  `RepetitiveResponseGroupViewDialog`, and
  `RepetitiveResponseGroupDeleteMethodDialog`.
- `RepetitiveResponsesSection`, `useRepetitiveResponseColumns`,
  `RepetitiveResponseDataTableToolbar`, `RepetitiveResponseRowActions`,
  `RepetitiveResponseFormDialog`, `RepetitiveResponseViewDialog`,
  `RepetitiveResponseDeleteMethodDialog`, and `RepetitiveResponseTextarea`.
- `RepetitiveResponseProvider`, `useRepetitiveResponseStore`,
  `useRepetitiveResponse`, and `useRepetitiveResponseGroup`.

The API service names also remain
`repetitiveResponseService` and `repetitiveResponseGroupService`. Their target
files use the workspace's `<domain>-service.ts` convention, so the name is
preserved in the exported value while the filename is architecture-compliant.

## Verified API and schema behavior

Response groups use `/repetitive-response-groups`:

- paged list: `GET /page`, default `page=0`, `size=30`
- item: `GET /:id`; create: `POST /`; update: `PUT /:id`
- delete variants: `DELETE /:id`, `PUT /soft-delete/:id`,
  `PUT /soft-delete`, and `DELETE /bulk-delete`

Responses use `/repetitive-responses`:

- paged list: `GET /page`, default `page=0`, `size=20`; full paged list:
  `GET /page-full`
- item: `GET /:id`; create: `POST /`; update: `PATCH /:id`
- delete variants: `DELETE /:id`, `PUT /soft-delete/:id`,
  `PUT /soft-delete`, and `DELETE /bulk-delete`

The target schemas retain the source fields and optional/nullability:
`id`, audit timestamps/users, `title`, `seqNum`, response `description`,
`usageCount`, `repetitiveResponseGroupId`, and optional embedded group.
Paginated responses use the workspace page-schema factory rather than copying
the reference's loose page object. Request schemas remain strict. Form-only
coercion and translated required/minimum validation remain in feature form
schemas.

## UI, accessibility, and performance

Use the existing target table, dialog, form, button, field, toast, and
permission primitives whenever they supply the reference behavior. Columns are
memoized through dedicated hooks; query keys include all transport state;
filters debounce high-frequency input; mutations disable pending submits and
invalidate only their relevant query keys. Long text uses the target's
accessible truncation primitive with a full-value affordance.

The reference determines visual hierarchy, copy, controls, and action order.
The implementation keeps visible labels for form fields, reachable keyboard
actions and Escape dismissal for dialogs, semantic destructive confirmation,
clear pending feedback, visible focus, and no color-only state indicator.

## Testing and verification

Add focused tests before each implementation unit for:

- valid and invalid request/response schemas, including null/optional fields;
- every service method's path, HTTP method, payload/query placement, and
  validation;
- route/table URL state and page composition;
- key user behavior: filters, row actions, pending controls, and mutation cache
  refresh;
- exact mounted Persian translation values copied from the reference.

Before completion, run feature tests, iap-admin tests with
`INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`,
typecheck, lint, and `git diff --check`. Existing unrelated baseline failures
must be reported separately.
