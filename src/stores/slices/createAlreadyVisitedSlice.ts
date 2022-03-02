import { SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'

export interface AlreadyVisitedSlice {
  alreadyVisited: boolean
  setAlreadyVisited: () => void
}

export const createAlreadyVisitedSlice = (set: SetState<PersistedState>): AlreadyVisitedSlice => ({
  alreadyVisited: false,
  setAlreadyVisited: () => set({ alreadyVisited: true }),
})
