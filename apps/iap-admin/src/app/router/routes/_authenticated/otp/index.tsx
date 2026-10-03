import { OtpPage } from '@features/otp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/otp/')({
  component: OtpPage,
  loader: () => ({ crumb: 'otp' }),
})
