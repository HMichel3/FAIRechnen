import { NewAddition, NewIncome, NewPurchase } from '../App/types'
import { Addition } from './types'

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
    return { ...addition, amount: newAdditionAmount, memberAmount: additionMemberAmount }
  })
  return { newAdditionsAmount, newAdditions }
}

export const calculateNewPurchase = (purchase: NewPurchase) => {
  const { newAdditionsAmount, newAdditions } = calculateNewAdditions(purchase.additions)
  const purchaseAmountWithoutAdditions = purchase.amount - newAdditionsAmount
  const [newPurchaseAmount, purchaseMemberAmount] = calculateNewAmount(
    purchaseAmountWithoutAdditions,
    purchase.beneficiaryIds
  )
  return {
    ...purchase,
    amount: newPurchaseAmount + newAdditionsAmount,
    additions: newAdditions,
    memberAmount: purchaseMemberAmount,
  }
}

export const calculateNewIncome = (income: NewIncome) => {
  const [newIncomeAmount, incomeMemberAmount] = calculateNewAmount(income.amount, income.beneficiaryIds)
  return { ...income, amount: newIncomeAmount, memberAmount: incomeMemberAmount }
}
