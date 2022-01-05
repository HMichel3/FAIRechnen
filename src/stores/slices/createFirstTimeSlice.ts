import { SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'

export interface FirstTimeSlice {
  firstTime: boolean
  setFirstTimeFalse: () => void
}

export const createFirstTimeSlice = (set: SetState<PersistedState>): FirstTimeSlice => ({
  firstTime: true,
  setFirstTimeFalse: () => set({ firstTime: false }),
})
