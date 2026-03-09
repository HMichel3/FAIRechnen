import { produce } from 'immer'
import { evolve, filter, map, multiply, pipe, prop, sortBy } from 'remeda'
import { CompensationWithoutTimestamp, MemberWithAmounts } from '../types/common'
import { findItemIndex } from './common'

export const generatePossibleCompensations = (membersWithAmounts: MemberWithAmounts[]) => {
  const debtors = pipe(
    membersWithAmounts,
    filter(m => m.current < 0),
    map(evolve({ current: multiply(-1) })),
    sortBy([prop('current'), 'desc'])
  )
  const creditors = pipe(
    membersWithAmounts,
    filter(m => m.current > 0),
    map(m => ({ ...m })),
    sortBy([prop('current'), 'desc'])
  )
  const compensations: CompensationWithoutTimestamp[] = []
  let debtorIndex = 0
  let creditorIndex = 0
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    const amountToPay = Math.min(debtor.current, creditor.current)
    const id = [debtor.id, creditor.id].sort().join('--')
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
  return sortBy(compensations, [prop('amount'), 'desc'])
}

export const generateCompensationChain = (membersWithAmounts: MemberWithAmounts[]) => {
  const addedCompensations: CompensationWithoutTimestamp[] = []
  for (let result; (result = generatePossibleCompensations(membersWithAmounts)); ) {
    if (result.length === 0) {
      break
    }
    const { amount, payerId, receiverId } = result[0]
    membersWithAmounts = produce(membersWithAmounts, draft => {
      const payerIndex = findItemIndex(payerId, draft)
      const receiverIndex = findItemIndex(receiverId, draft)
      if (payerIndex === -1 || receiverIndex === -1) {
        return
      }
      draft[payerIndex].current += amount
      draft[receiverIndex].current += -amount
    })
    addedCompensations.push(result[0])
  }
  return addedCompensations
}
