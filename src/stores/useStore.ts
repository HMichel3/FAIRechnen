import { create } from 'zustand'
import { AnimationSlice, createAnimationSlice } from './slices/createAnimationSlice'

export type StoreState = AnimationSlice

export const useStore = create<StoreState>()((...a) => ({
  ...createAnimationSlice(...a),
}))
