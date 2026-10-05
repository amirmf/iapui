import { create } from 'zustand'

export type AuditInformation = {
  createdAt?: string | null
  createdBy?: string | null
  updatedAt?: string | null
  updatedBy?: string | null
}

type AuditInformationDialogStore = AuditInformation & {
  isOpen: boolean
  open: (data: AuditInformation) => void
  reset: () => void
}

const initialState: AuditInformation & { isOpen: boolean } = {
  createdAt: undefined,
  createdBy: undefined,
  isOpen: false,
  updatedAt: undefined,
  updatedBy: undefined,
}

export const useAuditInformationDialogStore =
  create<AuditInformationDialogStore>((set) => ({
    ...initialState,
    open: (data) => set({ ...initialState, ...data, isOpen: true }),
    reset: () => set(initialState),
  }))
