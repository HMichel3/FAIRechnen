import { GetState, SetState } from 'zustand'
import { Group, Purchase } from '../../App/types'
import { findItemsById, removeItemsById, updateArrayItemById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'
import { calculateNewPurchase } from '../utils'

export interface PurchaseSlice {
  purchases: Purchase[]
  addPurchase: (purchase: Purchase) => void
  editPurchase: (newPurchase: Purchase) => void
  deletePurchase: (purchaseId: Purchase['purchaseId']) => void
  deleteGroupPurchases: (groupId: Group['groupId']) => void
  getGroupPurchases: (groupId: Group['groupId']) => Purchase[]
}

export const createPurchaseSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): PurchaseSlice => ({
  purchases: [],
  addPurchase: purchase => set(s => ({ purchases: [...s.purchases, calculateNewPurchase(purchase)] })),
  editPurchase: newPurchase =>
    set(s => ({
      purchases: updateArrayItemById(
        newPurchase.purchaseId,
        calculateNewPurchase(newPurchase),
        s.purchases,
        'purchaseId'
      ),
    })),
  deletePurchase: purchaseId => set(s => ({ purchases: removeItemsById(purchaseId, s.purchases, 'purchaseId') })),
  deleteGroupPurchases: groupId => set(s => ({ purchases: removeItemsById(groupId, s.purchases, 'groupId') })),
  getGroupPurchases: groupId => findItemsById(groupId, get().purchases, 'groupId'),
})
