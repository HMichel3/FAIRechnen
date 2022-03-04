import { CopyWithPartial, Purchase } from '../App/types'
import { v4 as uuid } from 'uuid'
import { trim } from 'ramda'

type PurchaseDTO = CopyWithPartial<Purchase, 'purchaseId' | 'timestamp'>

export const purchaseDTO = (purchase: PurchaseDTO): Purchase => ({
  groupId: purchase.groupId,
  purchaseId: purchase.purchaseId ?? uuid(),
  timestamp: purchase.timestamp ?? Date.now(),
  name: trim(purchase.name),
  amount: purchase.amount,
  purchaserId: purchase.purchaserId,
  beneficiaryIds: purchase.beneficiaryIds,
  description: purchase.description,
  additions: purchase.additions,
})
