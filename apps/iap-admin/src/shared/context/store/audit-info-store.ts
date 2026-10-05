import { create } from 'zustand'

export type AuditInfo = {
  createdAt?: string | null
  createdBy?: string | null
  updatedAt?: string | null
  updatedBy?: string | null
}

type AuditInfoStore = AuditInfo & {
  close: () => void
  isOpen: boolean
  open: (data: AuditInfo) => void
}

const initialState: AuditInfo & { isOpen: boolean } = { isOpen: false }

export const useAuditInfoStore = create<AuditInfoStore>((set) => ({
  ...initialState,
  close: () => set(initialState),
  open: (data) => set({ ...data, isOpen: true }),
}))
