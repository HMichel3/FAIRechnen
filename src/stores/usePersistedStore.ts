import { create, StateCreator } from 'zustand'
import { Drivers, Storage } from '@ionic/storage'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createCompensationSlice, CompensationSlice } from './slices/createCompensationSlice'
import { createGroupSlice, GroupSlice } from './slices/createGroupSlice'
import { createMemberSlice, MemberSlice } from './slices/createMemberSlice'
import { createPurchaseSlice, PurchaseSlice } from './slices/createPurchaseSlice'
import { createIncomeSlice, IncomeSlice } from './slices/createIncomeSlice'
import { InfoSlideSlice, createInfoSlideSlice } from './slices/createInfoSlideSlice'
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

const ionicStorage = new Storage({
  name: '__db',
  driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage],
})
await ionicStorage.defineDriver(CordovaSQLiteDriver)
await ionicStorage.create()

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
  InfoSlideSlice & { _hasHydrated: boolean }

// Needed for the Type of the Slices, where T is the particular SliceState
export type PersistImmer<T> = StateCreator<
  PersistedState,
  [['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  T
>

export const usePersistedStore = create<PersistedState>()(
  persist(
    immer((...a) => ({
      ...createGroupSlice(...a),
      ...createMemberSlice(...a),
      ...createPurchaseSlice(...a),
      ...createIncomeSlice(...a),
      ...createCompensationSlice(...a),
      ...createInfoSlideSlice(...a),
      _hasHydrated: false,
    })),
    {
      name: 'store-storage',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => () => {
        usePersistedStore.setState({ _hasHydrated: true })
      },
    }
  )
)
