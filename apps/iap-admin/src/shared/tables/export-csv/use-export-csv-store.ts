import { create } from 'zustand'

type ExportCsvState = {
  finishExport: (key: string) => void
  isExportingByKey: Record<string, boolean>
  startExport: (key: string) => boolean
}

export const useExportCsvStore = create<ExportCsvState>()((set, get) => ({
  finishExport: (key) => {
    set((state) => ({
      isExportingByKey: {
        ...state.isExportingByKey,
        [key]: false,
      },
    }))
  },
  isExportingByKey: {},
  startExport: (key) => {
    if (get().isExportingByKey[key]) return false

    set((state) => ({
      isExportingByKey: {
        ...state.isExportingByKey,
        [key]: true,
      },
    }))
    return true
  },
}))
