import create from 'zustand'
import { createSelectedGroupSlice, SelectedGroupSlice } from './slices/createSelectedGroupSlice'
import { createAnimationSlice, AnimationSlice } from './slices/createAnimationSlice'

export type StoreState = SelectedGroupSlice & AnimationSlice

export const useStore = create<StoreState>()((...a) => ({
  ...createSelectedGroupSlice(...a),
  ...createAnimationSlice(...a),
}))
