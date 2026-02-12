import { NewPurchase } from '../../App/types'
import { findItem, rejectById } from '../../App/utils'
import { PersistImmer } from '../usePersistedStore'
import { calculateNewPurchase, withMetaData } from '../utils'

export type PurchaseSlice = {
  addPurchase: (groupId: string, newPurchase: NewPurchase) => void
  editPurchase: (groupId: string, purchaseId: string, newPurchase: NewPurchase) => void
  deletePurchase: (groupId: string, purchaseId: string) => void
}

export const createPurchaseSlice: PersistImmer<PurchaseSlice> = set => ({
  addPurchase: (groupId, newPurchase) =>
    set(store => {
      const foundGroup = findItem(groupId, store.groups)
      if (!foundGroup) return
      const purchase = withMetaData(calculateNewPurchase(newPurchase))
      foundGroup.purchases.push(purchase)
    }),
  editPurchase: (groupId, purchaseId, newPurchase) =>
    set(store => {
      const foundGroup = findItem(groupId, store.groups)
      if (!foundGroup) return
      const foundPurchase = findItem(purchaseId, foundGroup.purchases)
      if (!foundPurchase) return
      Object.assign(foundPurchase, calculateNewPurchase(newPurchase))
    }),
  deletePurchase: (groupId, purchaseId) =>
    set(store => {
      const foundGroup = findItem(groupId, store.groups)
      if (!foundGroup) return
      foundGroup.purchases = rejectById(purchaseId, foundGroup.purchases)
    }),
})
