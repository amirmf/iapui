# Authentication session ownership

## Objective

Move persisted authentication-session state out of `@iap/api-client` so the
package remains a transport-only capability.

## Scope

- Move the Zustand authentication session store into `@iap/auth`.
- Replace direct auth-state ownership in `@iap/api-client` with a transport
  configuration contract that receives the current access token.
- Preserve token persistence, user refresh, logout behavior, and request
  authentication in both applications.

## Acceptance criteria

- `@iap/api-client` has no Zustand dependency and exports no auth store.
- `@iap/auth` owns session state and its public session API.
- Both apps configure API authentication before authenticated requests run.
- Authentication package tests and application typechecks pass.

## Status

Complete. The persisted Zustand session store is owned by `@iap/auth`; the API
client receives an access-token getter from each application during setup and
has no Zustand or API-type dependency.
