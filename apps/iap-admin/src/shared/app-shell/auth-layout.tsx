import { SupportFlowWidget } from '@iap/support'
import { Outlet } from '@tanstack/react-router'

export function AuthLayout() {
  return (
    <>
      <Outlet />
      <SupportFlowWidget colorContext='auth' />
    </>
  )
}
