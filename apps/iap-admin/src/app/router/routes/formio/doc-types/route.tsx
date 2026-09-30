import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/formio/doc-types')({
  component: Outlet,
})
