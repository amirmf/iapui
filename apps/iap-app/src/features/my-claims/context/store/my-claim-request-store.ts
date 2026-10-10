import type { ClaimRequest } from '@iap/api-types'
import { create } from 'zustand'

type MyClaimRequestState = {
  open: 'delete' | null
  currentRow: ClaimRequest | null
  setOpen: (open: 'delete' | null) => void
  setCurrentRow: (currentRow: ClaimRequest | null) => void
  reset: () => void
}

export const useMyClaimRequestStore = create<MyClaimRequestState>((set) => ({
  open: null,
  currentRow: null,
  setOpen: (open) => set({ open }),
  setCurrentRow: (currentRow) => set({ currentRow }),
  reset: () => set({ open: null, currentRow: null }),
}))
