import create from 'zustand'
import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { persist } from 'zustand/middleware'
import { storage } from './storage'
import { createCompensationSlice, CompensationSlice } from './slices/createCompensationSlice'
import { createGroupSlice, GroupSlice } from './slices/createGroupSlice'
import { createMemberSlice, MemberSlice } from './slices/createMemberSlice'
import { createPurchaseSlice, PurchaseSlice } from './slices/createPurchaseSlice'
import { createThemeSlice, ThemeSlice } from './slices/createThemeSlice'
import { createIncomeSlice, IncomeSlice } from './slices/createIncomeSlice'

export type PersistedState = GroupSlice & MemberSlice & PurchaseSlice & IncomeSlice & CompensationSlice & ThemeSlice

const usePersistedStoreBase = create<PersistedState>(
  persist(
    (set, get) => ({
      ...createGroupSlice(set, get),
      ...createMemberSlice(set, get),
      ...createPurchaseSlice(set, get),
      ...createIncomeSlice(set, get),
      ...createCompensationSlice(set, get),
      ...createThemeSlice(set),
    }),
    {
      name: 'store-storage',
      getStorage: () => storage,
    }
  )
)

// automatically creates hook style selectors
export const usePersistedStore = createSelectorHooks(usePersistedStoreBase)
