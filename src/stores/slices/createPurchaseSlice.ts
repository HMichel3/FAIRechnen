import { SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'
import { calculateNewPurchase } from '../utils'
import { v4 as uuid } from 'uuid'
import produce from 'immer'
import { NewPurchase } from '../../App/types'
import { findItemIndex } from '../../App/utils'
import { Purchase } from '../types'

export interface PurchaseSlice {
  addPurchase: (groupId: string, newPurchase: NewPurchase) => void
  editPurchase: (groupId: string, purchaseId: string, newPurchase: NewPurchase) => void
  deletePurchase: (groupId: string, purchaseId: string) => void
}

export const createPurchaseSlice = (set: SetState<PersistedState>): PurchaseSlice => ({
  addPurchase: (groupId, newPurchase) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        store.groups[groupIndex].purchases.push(
          produce(calculateNewPurchase(newPurchase) as Purchase, draft => {
            draft['id'] = uuid()
            draft['timestamp'] = Date.now()
          })
        )
      })
    ),
  editPurchase: (groupId, purchaseId, newPurchase) =>
    set(
      produce<PersistedState>(store => {
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
      })
    ),
  deletePurchase: (groupId, purchaseId) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        const purchaseIndex = findItemIndex(purchaseId, store.groups[groupIndex].purchases)
        if (purchaseIndex === -1) return
        store.groups[groupIndex].purchases.splice(purchaseIndex, 1)
      })
    ),
})
