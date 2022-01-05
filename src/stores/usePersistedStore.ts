import create from 'zustand'
import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { persist } from 'zustand/middleware'
import { storage } from './storage'
import { createCompensationSlice, CompensationSlice } from './slices/createCompensationSlice'
import { createGroupSlice, GroupSlice } from './slices/createGroupSlice'
import { createMemberSlice, MemberSlice } from './slices/createMemberSlice'
import { createPurchaseSlice, PurchaseSlice } from './slices/createPurchaseSlice'
import { createThemeSlice, ThemeSlice } from './slices/createThemeSlice'
import { createFirstTimeSlice, FirstTimeSlice } from './slices/createFirstTimeSlice'

export type PersistedState = GroupSlice & MemberSlice & PurchaseSlice & CompensationSlice & ThemeSlice & FirstTimeSlice

const usePersistedStoreBase = create<PersistedState>(
  persist(
    (set, get) => ({
      ...createGroupSlice(set, get),
      ...createMemberSlice(set, get),
      ...createPurchaseSlice(set, get),
      ...createCompensationSlice(set, get),
      ...createThemeSlice(set),
      ...createFirstTimeSlice(set),
    }),
    {
      name: 'store-storage',
      getStorage: () => storage,
    }
  )
)

// automatically creates hook style selectors
export const usePersistedStore = createSelectorHooks(usePersistedStoreBase)
