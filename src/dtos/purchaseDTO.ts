import { Purchase } from '../App/types'
import { v4 as uuid } from 'uuid'

export type PurchaseWithoutIdAndTimeStamp = Omit<Purchase, 'id' | 'timestamp'>

export const purchaseDTO = (purchase: PurchaseWithoutIdAndTimeStamp): Purchase => ({
  groupId: purchase.groupId,
  id: uuid(),
  timestamp: Date.now(),
  name: purchase.name,
  amount: purchase.amount,
  purchaserId: purchase.purchaserId,
  beneficiaryIds: purchase.beneficiaryIds,
  isPurchaserOnlyPaying: purchase.isPurchaserOnlyPaying,
  additions: purchase.additions,
})
