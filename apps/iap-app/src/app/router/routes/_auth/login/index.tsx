import { Login } from '@features/auth'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/login/')({
  component: Login,
  validateSearch: z.object({
    callbackUrl: z.string().optional(),
  }),
})
