import agentUserService from '@features/agent-users/services/agent-user-service'
import { useMutation } from '@tanstack/react-query'

export function useAgentUserSignup(onSuccess: () => void) {
  return useMutation({
    meta: { errorPresentation: 'reference' },
    mutationFn: agentUserService.signup,
    onSuccess,
  })
}
