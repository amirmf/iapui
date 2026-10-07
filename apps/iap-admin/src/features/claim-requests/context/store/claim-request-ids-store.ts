import { create } from 'zustand'

type ClaimRequestIdsStore = {
  ids: string[]
  setIds: (ids: string[]) => void
  setRemoveId: (id: string) => void
}

export const useClaimRequestIds = create<ClaimRequestIdsStore>((set) => ({
  ids: [],
  setIds: (ids) => set({ ids }),
  setRemoveId: (id) =>
    set((state) => {
      const index = state.ids.indexOf(id)
      return index === -1
        ? state
        : { ids: [...state.ids.slice(0, index), ...state.ids.slice(index + 1)] }
    }),
}))
