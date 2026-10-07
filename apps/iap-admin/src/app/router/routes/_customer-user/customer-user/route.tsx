import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_customer-user/customer-user')({
  component: Outlet,
})
