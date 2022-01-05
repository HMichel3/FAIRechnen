import { SetState } from 'zustand'
import { StoreState } from '../useStore'

export interface AnimationSlice {
  showAnimation: boolean
  setShowAnimationOnce: () => void
}

export const createAnimationSlice = (set: SetState<StoreState>): AnimationSlice => ({
  showAnimation: false,
  setShowAnimationOnce: () => {
    set({ showAnimation: true })
    setTimeout(() => {
      set({ showAnimation: false })
    }, 1000)
  },
})
