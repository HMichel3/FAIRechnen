import { Drivers, Storage } from '@ionic/storage'
// automatically uses cordova-sqlite-storage if installed via package.json
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { CompensationSlice, createCompensationSlice } from './slices/createCompensationSlice'
import { ContactSlice, createContactSlice } from './slices/createContactSlice'
import { createGroupSlice, GroupSlice } from './slices/createGroupSlice'
import { createIncomeSlice, IncomeSlice } from './slices/createIncomeSlice'
import { createInfoSlideSlice, InfoSlideSlice } from './slices/createInfoSlideSlice'
import { createMemberSlice, MemberSlice } from './slices/createMemberSlice'
import { createPurchaseSlice, PurchaseSlice } from './slices/createPurchaseSlice'

const STORAGE_NAME = '__db'
const STORAGE_KEY = 'store-storage'

const ionicStorage = new Storage({
  name: STORAGE_NAME,
  driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage],
})
await ionicStorage.defineDriver(CordovaSQLiteDriver)
await ionicStorage.create()

async function migrateIndexedDBtoSQLite() {
  const activeDriver = ionicStorage.driver
  if (activeDriver === CordovaSQLiteDriver._driver) {
    const sqliteData = await ionicStorage.get(STORAGE_KEY)
    if (!sqliteData) {
      const fallbackStorage = new Storage({
        name: STORAGE_NAME,
        driverOrder: [Drivers.IndexedDB],
      })
      await fallbackStorage.create()
      const oldIndexedDbData = await fallbackStorage.get(STORAGE_KEY)
      if (oldIndexedDbData) {
        await ionicStorage.set(STORAGE_KEY, oldIndexedDbData)
        await fallbackStorage.remove(STORAGE_KEY)
      }
    }
  }
}

await migrateIndexedDBtoSQLite() // needed because of bug on previous app version, where the data was only stored in indexedDB

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
  InfoSlideSlice &
  ContactSlice & { _hasHydrated: boolean }

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
      ...createContactSlice(...a),
      _hasHydrated: false,
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => storage),
      partialize: state => ({
        groups: state.groups,
        groupArchive: state.groupArchive,
        isInfoSlideOpen: state.isInfoSlideOpen,
        contacts: state.contacts,
      }),
      onRehydrateStorage: () => () => {
        usePersistedStore.setState({ _hasHydrated: true })
      },
    }
  )
)
