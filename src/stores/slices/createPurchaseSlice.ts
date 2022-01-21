import { GetState, SetState } from 'zustand'
import { purchaseDTO, PurchaseWithoutIdAndTimeStamp } from '../../dtos/purchaseDTO'
import { Group, Purchase } from '../../App/types'
import { getArrayItemById, getArrayItemsByGroupId, removeArrayItemsById, updateArrayItemById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'
import {
  addPurchaserToBeneficiariesIfNeeded,
  checkIfAllIdsExistInMembers,
  getAllBeneficiaryIdsFromPurchase,
} from '../utils'

export interface PurchaseSlice {
  purchases: Purchase[]
  addPurchase: (almostPurchase: PurchaseWithoutIdAndTimeStamp) => void
  editPurchase: (purchaseId: Purchase['id'], oldPurchase: Purchase, newPurchase: Purchase) => void
  deletePurchase: (purchaseId: Purchase['id']) => void
  deleteGroupPurchases: (groupId: Group['id']) => void
  getGroupPurchases: (groupId: Group['id']) => Purchase[]
}

export const createPurchaseSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): PurchaseSlice => ({
  purchases: [],
  addPurchase: almostPurchase => {
    const [newAdditionsTotalAmount, newAdditions] = get().adjustAdditionsAmountsOnMembers(
      almostPurchase.additions,
      almostPurchase.purchaserId
    )
    const purchaseAmountWithoutAdditions = almostPurchase.amount - newAdditionsTotalAmount
    const allPurchaseBeneficiaries = addPurchaserToBeneficiariesIfNeeded(almostPurchase)
    const newPurchaseAmount = get().adjustPurchaseAmountOnMembers(
      purchaseAmountWithoutAdditions,
      almostPurchase.purchaserId,
      allPurchaseBeneficiaries
    )
    const newTotalAmount = newPurchaseAmount + newAdditionsTotalAmount
    const purchase = purchaseDTO({ ...almostPurchase, amount: newTotalAmount, additions: newAdditions })
    set({ purchases: [...get().purchases, purchase] })
  },
  editPurchase: (purchaseId, oldPurchase, newPurchase) => {
    // revert oldPurchase
    const allBeneficiaryIdsFromPurchase = getAllBeneficiaryIdsFromPurchase(
      oldPurchase.beneficiaryIds,
      oldPurchase.additions
    )
    if (checkIfAllIdsExistInMembers([oldPurchase.purchaserId, ...allBeneficiaryIdsFromPurchase], get().members)) {
      const [additionsTotalAmount] = get().adjustAdditionsAmountsOnMembers(
        oldPurchase.additions,
        oldPurchase.purchaserId,
        true
      )
      const amountWithoutAdditions = oldPurchase.amount - additionsTotalAmount
      const allOldPurchaseBeneficiaries = addPurchaserToBeneficiariesIfNeeded(oldPurchase)
      get().adjustPurchaseAmountOnMembers(-amountWithoutAdditions, oldPurchase.purchaserId, allOldPurchaseBeneficiaries)
    }
    // update oldPurchase
    const [newAdditionsTotalAmount, newAdditions] = get().adjustAdditionsAmountsOnMembers(
      newPurchase.additions,
      newPurchase.purchaserId
    )
    const purchaseAmountWithoutAdditions = newPurchase.amount - newAdditionsTotalAmount
    const allNewPurchaseBeneficiaries = addPurchaserToBeneficiariesIfNeeded(newPurchase)
    const newPurchaseAmount = get().adjustPurchaseAmountOnMembers(
      purchaseAmountWithoutAdditions,
      newPurchase.purchaserId,
      allNewPurchaseBeneficiaries
    )
    const newTotalAmount = newPurchaseAmount + newAdditionsTotalAmount
    const newPurchaseWithAmount: Purchase = { ...newPurchase, amount: newTotalAmount, additions: newAdditions }
    set({ purchases: updateArrayItemById(purchaseId, newPurchaseWithAmount, get().purchases) })
    get().deleteDeletedMembersAfterCheck([...allBeneficiaryIdsFromPurchase, oldPurchase.purchaserId])
  },
  deletePurchase: purchaseId => {
    const { amount, purchaserId, beneficiaryIds, isPurchaserOnlyPaying, additions } = getArrayItemById(
      purchaseId,
      get().purchases
    )
    const allBeneficiaryIdsFromPurchase = getAllBeneficiaryIdsFromPurchase(beneficiaryIds, additions)
    if (checkIfAllIdsExistInMembers([purchaserId, ...allBeneficiaryIdsFromPurchase], get().members)) {
      // negative amount, because it gets deleted
      const [additionsTotalAmount] = get().adjustAdditionsAmountsOnMembers(additions, purchaserId, true)
      const amountWithoutAdditions = amount - additionsTotalAmount
      const allPurchaseBeneficiaries = addPurchaserToBeneficiariesIfNeeded({
        purchaserId,
        beneficiaryIds,
        isPurchaserOnlyPaying,
      })
      get().adjustPurchaseAmountOnMembers(-amountWithoutAdditions, purchaserId, allPurchaseBeneficiaries)
    }
    set({ purchases: removeArrayItemsById(purchaseId, get().purchases) })
    get().deleteDeletedMembersAfterCheck([...allBeneficiaryIdsFromPurchase, purchaserId])
  },
  deleteGroupPurchases: groupId => {
    set({ purchases: removeArrayItemsById(groupId, get().purchases, 'groupId') })
  },
  getGroupPurchases: groupId => {
    return getArrayItemsByGroupId(groupId, get().purchases)
  },
})
