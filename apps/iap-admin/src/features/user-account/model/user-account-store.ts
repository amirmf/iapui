import type { UserAccount } from '@iap/api-types'
import { create } from 'zustand'

export type UserAccountDialog =
  | 'create'
  | 'delete'
  | 'userAccount'
  | 'reset-password'
  | 'specialDiseases'
  | 'view'
  | null

type UserAccountState = {
  currentUser: UserAccount | null
  dialog: UserAccountDialog
  reset: () => void
  openDialog: (
    dialog: Exclude<UserAccountDialog, null>,
    user?: UserAccount
  ) => void
  closeDialog: () => void
}

export const useUserAccountStore = create<UserAccountState>((set) => ({
  closeDialog: () => {
    set({ dialog: null })
    window.setTimeout(() => {
      set((state) => (state.dialog === null ? { currentUser: null } : {}))
    }, 500)
  },
  currentUser: null,
  dialog: null,
  openDialog: (dialog, currentUser) =>
    set({
      currentUser: currentUser ?? null,
      dialog,
    }),
  reset: () => set({ currentUser: null, dialog: null }),
}))
