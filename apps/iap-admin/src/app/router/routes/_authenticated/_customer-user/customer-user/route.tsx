import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_customer-user/customer-user'
)({
  component: Outlet,
})
