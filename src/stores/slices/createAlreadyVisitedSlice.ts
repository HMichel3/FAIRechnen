import { StateCreator } from 'zustand'
import { PersistImmer, PersistedState } from '../usePersistedStore'

export interface AlreadyVisitedSlice {
  alreadyVisited: boolean
  setAlreadyVisited: () => void
}

export const createAlreadyVisitedSlice: StateCreator<PersistedState, PersistImmer, [], AlreadyVisitedSlice> = set => ({
  alreadyVisited: false,
  setAlreadyVisited: () => set({ alreadyVisited: true }),
})
