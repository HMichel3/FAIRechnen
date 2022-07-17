import { PersistImmer } from '../usePersistedStore'

export interface AlreadyVisitedSlice {
  alreadyVisited: boolean
  setAlreadyVisited: () => void
}

export const createAlreadyVisitedSlice: PersistImmer<AlreadyVisitedSlice> = set => ({
  alreadyVisited: false,
  setAlreadyVisited: () => set({ alreadyVisited: true }),
})
