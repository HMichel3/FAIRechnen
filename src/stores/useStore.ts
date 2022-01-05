import create from 'zustand'
import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { createSelectedGroupSlice, SelectedGroupSlice } from './slices/createSelectedGroupSlice'
import { createAnimationSlice, AnimationSlice } from './slices/createAnimationSlice'

export type StoreState = SelectedGroupSlice & AnimationSlice

const useStoreBase = create<StoreState>(set => ({
  ...createSelectedGroupSlice(set),
  ...createAnimationSlice(set),
}))

// automatically creates hook style selectors
export const useStore = createSelectorHooks(useStoreBase)
