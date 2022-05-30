import create from 'zustand'
import { Drivers, Storage } from '@ionic/storage'
import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { persist, StateStorage } from 'zustand/middleware'
import { createCompensationSlice, CompensationSlice } from './slices/createCompensationSlice'
import { createGroupSlice, GroupSlice } from './slices/createGroupSlice'
import { createMemberSlice, MemberSlice } from './slices/createMemberSlice'
import { createPurchaseSlice, PurchaseSlice } from './slices/createPurchaseSlice'
import { createThemeSlice, ThemeSlice } from './slices/createThemeSlice'
import { createIncomeSlice, IncomeSlice } from './slices/createIncomeSlice'
import { AlreadyVisitedSlice, createAlreadyVisitedSlice } from './slices/createAlreadyVisitedSlice'
import { createGroupTemplateSlice, GroupTemplateSlice } from './slices/createGroupTemplateSlice'

const ionicStorage = new Storage({
  name: '__db',
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
})

const storage: StateStorage = {
  getItem: async key => {
    return (await ionicStorage.get(key)) || null
  },
  setItem: async (key, value) => {
    await ionicStorage.set(key, value)
  },
  removeItem: async key => {
    await ionicStorage.remove(key)
  },
}

export type PersistedState = GroupSlice &
  MemberSlice &
  PurchaseSlice &
  IncomeSlice &
  CompensationSlice &
  ThemeSlice &
  AlreadyVisitedSlice &
  GroupTemplateSlice & { _hasHydrated: boolean }

const usePersistedStoreBase = create<PersistedState>(
  persist(
    (set, get) => ({
      ...createGroupSlice(set, get),
      ...createMemberSlice(set),
      ...createPurchaseSlice(set),
      ...createIncomeSlice(set),
      ...createCompensationSlice(set),
      ...createThemeSlice(set),
      ...createAlreadyVisitedSlice(set),
      ...createGroupTemplateSlice(set),
      _hasHydrated: false,
    }),
    {
      name: 'store-storage',
      getStorage: () => {
        const createStore = async () => {
          await ionicStorage.create()
        }
        createStore()
        return storage
      },
      onRehydrateStorage: () => () => {
        usePersistedStore.setState({ _hasHydrated: true })
      },
    }
  )
)

// automatically creates hook style selectors
export const usePersistedStore = createSelectorHooks(usePersistedStoreBase)
