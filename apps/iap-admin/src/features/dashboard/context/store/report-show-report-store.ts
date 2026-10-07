import { create } from 'zustand'

export interface ShowReportState {
  isShowReport: boolean
  toggleShowReport: () => void
}

export const useShowReport = create<ShowReportState>((set) => ({
  isShowReport: false,
  toggleShowReport: () =>
    set((prevState) => ({ isShowReport: !prevState.isShowReport })),
}))
