import type { SetStateAction } from 'react'

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
  currentRow: UserAccount | null
  currentUser: UserAccount | null
  dialog: UserAccountDialog
  open: UserAccountDialog
  reset: () => void
  setCurrentRow: (updater: SetStateAction<UserAccount | null>) => void
  setOpen: (open: UserAccountDialog) => void
  openDialog: (
    dialog: Exclude<UserAccountDialog, null>,
    user?: UserAccount
  ) => void
  closeDialog: () => void
}

export const useUserAccountStore = create<UserAccountState>((set) => ({
  closeDialog: () => {
    set({ dialog: null, open: null })
    window.setTimeout(() => set({ currentRow: null, currentUser: null }), 500)
  },
  currentRow: null,
  currentUser: null,
  dialog: null,
  open: null,
  openDialog: (dialog, currentUser) =>
    set({
      currentRow: currentUser ?? null,
      currentUser: currentUser ?? null,
      dialog,
      open: dialog,
    }),
  reset: () =>
    set({ currentRow: null, currentUser: null, dialog: null, open: null }),
  setCurrentRow: (updater) =>
    set((state) => ({
      currentRow:
        typeof updater === 'function' ? updater(state.currentRow) : updater,
    })),
  setOpen: (open) => set({ dialog: open, open }),
}))
