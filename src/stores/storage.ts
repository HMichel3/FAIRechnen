import { Drivers, Storage } from '@ionic/storage'
import { StateStorage } from 'zustand/middleware'

const ionicStorage = new Storage({
  name: '__db',
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
})

export const storage: StateStorage = {
  getItem: async key => {
    await ionicStorage.create()
    return (await ionicStorage.get(key)) ?? []
  },
  setItem: async (key, value) => {
    await ionicStorage.create()
    await ionicStorage.set(key, value)
  },
  removeItem: async key => {
    await ionicStorage.create()
    await ionicStorage.remove(key)
  },
}
