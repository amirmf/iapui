import { type ReactNode, useEffect } from 'react'

import type { ClaimRequest } from '@iap/api-types'
import { create } from 'zustand'

type AgentClaimRequestDialogType = 'delete'

interface AgentClaimRequestState {
  open: AgentClaimRequestDialogType | null
  setOpen: (open: AgentClaimRequestDialogType | null) => void
  currentRow: ClaimRequest | null
  setCurrentRow: (currentRow: ClaimRequest | null) => void
  reset: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAgentClaimRequestStore = create<AgentClaimRequestState>(
  (set) => ({
    open: null,
    currentRow: null,
    setOpen: (open) => set({ open }),
    setCurrentRow: (currentRow) => set({ currentRow }),
    reset: () =>
      set({
        open: null,
        currentRow: null,
      }),
  })
)

interface Props {
  children: ReactNode
}

export default function AgentClaimRequestProvider({ children }: Props) {
  const reset = useAgentClaimRequestStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAgentClaimRequest = useAgentClaimRequestStore
export { AgentClaimRequestProvider }
