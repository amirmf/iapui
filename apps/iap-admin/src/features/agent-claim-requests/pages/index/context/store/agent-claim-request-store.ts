import type { ClaimRequest } from '@iap/api-types'
import { create } from 'zustand'

export type AgentClaimRequestDialogType = 'delete'

export interface AgentClaimRequestState {
  open: AgentClaimRequestDialogType | null
  setOpen: (open: AgentClaimRequestDialogType | null) => void
  currentRow: ClaimRequest | null
  setCurrentRow: (currentRow: ClaimRequest | null) => void
  reset: () => void
}

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

export const useAgentClaimRequest = useAgentClaimRequestStore
