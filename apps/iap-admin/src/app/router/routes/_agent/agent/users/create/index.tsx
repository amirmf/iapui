import { AgentUserSignupPage } from '@features/agent-users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_agent/agent/users/create/')({
  component: AgentUserSignupPage,
  loader: () => ({ crumb: 'agentUserSignup' }),
})
