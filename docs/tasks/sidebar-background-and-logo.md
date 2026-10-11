# Sidebar background and logo parity

## Scope and source evidence

The operations AppSidebar in iap-admin uses the shared @iap/ui Sidebar.
Reference: insurance-ui/src/components/layout/app-sidebar.tsx and
insurance-ui/src/styles/_utilities.scss (sidebar-gradient rules).

## Verified discrepancies

- The shared Sidebar had sidebar-gradient classes without a CSS definition.
- Tenant preparation omitted VITE_SIDEBAR_LOGIN_LOGO and
  VITE_CUSTOMER_APP_HEADER_LOGO, although AppSidebar consumes both.

## Implementation

- Added the reference light and dark vertical gradients to shared design-token CSS,
  adapting reference color values to the workspace RGB-channel token format.
- Added explicit sidebar and customer-header asset paths for Alborz and Dana
  and generated both environment variables for each application and build mode.
- Dana uses its existing dana-logo.svg for the light sidebar; no dedicated Dana
  sidebar asset is present. Alborz paths match the reference environment.

## Completion criteria

Verify theme tests, tenant output and asset existence for both tenants and modes,
admin typecheck and lint, architecture checks, and diff whitespace checks.
Browser screenshot parity and live-backend verification are outside this check.

## Validation completed

- Shared design-token tests: 3 passed.
- Generated logo variables and asset existence verified for both tenants, both
  applications, and development/production modes using an isolated temporary root.
- Admin typecheck and lint passed.
- Architecture check, changed-file formatting, and git diff --check passed.
- Local development and production environment files regenerated.
- No browser screenshot or live-backend validation performed.
