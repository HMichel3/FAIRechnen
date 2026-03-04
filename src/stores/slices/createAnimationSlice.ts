import { StateCreator } from 'zustand'
import { StoreState } from '../useStore'

export type AnimationSlice = {
  isAnimationVisible: boolean
  showAnimation: () => void
  hideAnimation: () => void
}

export const createAnimationSlice: StateCreator<StoreState, [], [], AnimationSlice> = set => ({
  isAnimationVisible: false,
  showAnimation: () => set({ isAnimationVisible: true }),
  hideAnimation: () => set({ isAnimationVisible: false }),
})
