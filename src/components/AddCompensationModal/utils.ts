import { produce } from 'immer'
import { descend, isEmpty, join, prop, sort } from 'ramda'
import { CompensationWithoutTimestamp, MemberWithAmounts } from '../../App/types'
import { findItemIndex, isNegative, isPositive } from '../../App/utils'

export const generatePossibleCompensations = (membersWithAmounts: MemberWithAmounts[]) => {
  const debtors = membersWithAmounts
    .filter(m => isNegative(m.current))
    .map(m => ({ ...m, current: -m.current }))
    .toSorted(descend(prop('current')))
  const creditors = membersWithAmounts
    .filter(m => isPositive(m.current))
    .map(m => ({ ...m }))
    .toSorted(descend(prop('current')))
  const compensations: CompensationWithoutTimestamp[] = []
  let debtorIndex = 0
  let creditorIndex = 0
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    const amountToPay = Math.min(debtor.current, creditor.current)
    const id = join('--', [debtor.id, creditor.id].toSorted())
    compensations.push({ id, payerId: debtor.id, receiverId: creditor.id, amount: amountToPay })
    debtor.current -= amountToPay
    creditor.current -= amountToPay
    if (debtor.current === 0) {
      debtorIndex++
    }
    if (creditor.current === 0) {
      creditorIndex++
    }
  }
  return sort(descend(prop('amount')), compensations)
}

export const generateCompensationChain = (membersWithAmounts: MemberWithAmounts[]) => {
  const addedCompensations: CompensationWithoutTimestamp[] = []
  for (let result; (result = generatePossibleCompensations(membersWithAmounts)); ) {
    if (isEmpty(result)) break
    const { amount, payerId, receiverId } = result[0]
    membersWithAmounts = produce(membersWithAmounts, draft => {
      const payerIndex = findItemIndex(payerId, draft)
      const receiverIndex = findItemIndex(receiverId, draft)
      if (payerIndex === -1 || receiverIndex === -1) return
      draft[payerIndex].current += amount
      draft[receiverIndex].current += -amount
    })
    addedCompensations.push(result[0])
  }
  return addedCompensations
}
