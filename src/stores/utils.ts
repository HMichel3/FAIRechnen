import { produce } from 'immer'
import { NewAddition, NewIncome, NewPurchase } from '../App/types'
import { Addition, Income, Purchase } from './types'

const calculateNewAmount = (amount: number, beneficiaryIds: string[]) => {
  const memberCount = beneficiaryIds.length
  const memberAmount = Math.round(amount / memberCount)
  const newAmount = memberAmount * memberCount
  return [newAmount, memberAmount]
}

const calculateNewAdditions = (additions: NewAddition[]) => {
  let newAdditionsAmount = 0
  const newAdditions: Addition[] = additions.map(addition => {
    const [newAdditionAmount, additionMemberAmount] = calculateNewAmount(addition.amount, addition.payerIds)
    newAdditionsAmount += newAdditionAmount
    return produce(addition as Addition, draft => {
      draft.amount = newAdditionAmount
      draft['memberAmount'] = additionMemberAmount
    })
  })
  return { newAdditionsAmount, newAdditions }
}

// ensures that all amounts can be distributed completely
export const calculateNewPurchase = (purchase: NewPurchase) => {
  // calculate all new addition amounts
  const { newAdditionsAmount, newAdditions } = calculateNewAdditions(purchase.additions)

  // calculate new purchase amount
  const purchaseAmountWithoutAdditions = purchase.amount - newAdditionsAmount
  const [newPurchaseAmount, purchaseMemberAmount] = calculateNewAmount(
    purchaseAmountWithoutAdditions,
    purchase.beneficiaryIds
  )

  return produce(purchase as Omit<Purchase, 'id' | 'timestamp'>, draft => {
    draft.amount = newPurchaseAmount + newAdditionsAmount
    draft.additions = newAdditions
    draft['memberAmount'] = purchaseMemberAmount
  })
}

// ensures that all incomes can be distributed completely
export const calculateNewIncome = (income: NewIncome) => {
  const [newIncomeAmount, incomeMemberAmount] = calculateNewAmount(income.amount, income.beneficiaryIds)

  return produce(income as Omit<Income, 'id' | 'timestamp'>, draft => {
    draft.amount = newIncomeAmount
    draft['memberAmount'] = incomeMemberAmount
  })
}
