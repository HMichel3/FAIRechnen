import { PersistImmer } from '../usePersistedStore'
import { calculateNewPurchase } from '../utils'
import { produce } from 'immer'
import { findItemIndex } from '../../App/utils'
import { NewPurchase } from '../../App/types'
import { Purchase } from '../types'

export interface PurchaseSlice {
  addPurchase: (groupId: string, newPurchase: NewPurchase) => void
  editPurchase: (groupId: string, purchaseId: string, newPurchase: NewPurchase) => void
  deletePurchase: (groupId: string, purchaseId: string) => void
}

export const createPurchaseSlice: PersistImmer<PurchaseSlice> = set => ({
  addPurchase: (groupId, newPurchase) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groups[groupIndex].purchases.push(
        produce(calculateNewPurchase(newPurchase) as Purchase, draft => {
          draft['id'] = crypto.randomUUID()
          draft['timestamp'] = Date.now()
        })
      )
    }),
  editPurchase: (groupId, purchaseId, newPurchase) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const purchaseIndex = findItemIndex(purchaseId, store.groups[groupIndex].purchases)
      if (purchaseIndex === -1) return
      const { name, amount, purchaserId, beneficiaryIds, description, additions, memberAmount } =
        calculateNewPurchase(newPurchase)
      const purchase = store.groups[groupIndex].purchases[purchaseIndex]
      purchase.name = name
      purchase.amount = amount
      purchase.purchaserId = purchaserId
      purchase.beneficiaryIds = beneficiaryIds
      purchase.description = description
      purchase.additions = additions
      purchase.memberAmount = memberAmount
    }),
  deletePurchase: (groupId, purchaseId) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const purchaseIndex = findItemIndex(purchaseId, store.groups[groupIndex].purchases)
      if (purchaseIndex === -1) return
      store.groups[groupIndex].purchases.splice(purchaseIndex, 1)
    }),
})
