import { StateCreator } from 'zustand'
import { StoreState } from '../useStore'

export type AnimationSlice = {
  showAnimation: boolean
  setShowAnimation: () => void
}

export const createAnimationSlice: StateCreator<StoreState, [], [], AnimationSlice> = set => ({
  showAnimation: false,
  setShowAnimation: () => {
    set({ showAnimation: true })
    setTimeout(() => set({ showAnimation: false }), 1000)
  },
})
