import { useLocation } from '@tanstack/react-router'

export function useIsAgentPanel() {
  return useLocation({
    select: (location) => location.pathname.startsWith('/agent'),
  })
}
