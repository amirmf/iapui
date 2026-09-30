import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/formio/claim-requests')({
  component: Outlet,
})
