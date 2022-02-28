import { CopyWithPartial, Purchase } from '../App/types'
import { v4 as uuid } from 'uuid'

type PurchaseDTO = CopyWithPartial<Purchase, 'purchaseId' | 'timestamp'>

export const purchaseDTO = (purchase: PurchaseDTO): Purchase => ({
  groupId: purchase.groupId,
  purchaseId: purchase.purchaseId ?? uuid(),
  timestamp: purchase.timestamp ?? Date.now(),
  name: purchase.name,
  amount: purchase.amount,
  purchaserId: purchase.purchaserId,
  beneficiaryIds: purchase.beneficiaryIds,
  description: purchase.description,
  additions: purchase.additions,
})
