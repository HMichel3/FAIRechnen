import { Income, Purchase } from '../App/types'
import { getTotalAmountFromArray } from '../App/utils'

const calculateNewAmount = (amount: number, beneficiaryIds: string[]) => {
  const memberCount = beneficiaryIds.length
  const memberAmount = Math.round(amount / memberCount)
  return memberAmount * memberCount
}

// ensures that all amounts can be distributed completely
export const calculateNewPurchase = (purchase: Purchase): Purchase => {
  // calculate all new addition amounts
  const newAdditions = purchase.additions.map(addition => {
    const amount = calculateNewAmount(addition.amount, addition.payerIds)
    return { ...addition, amount }
  })
  const newAdditionsAmount = getTotalAmountFromArray(newAdditions)

  // calculate new purchase amount
  const purchaseAmountWithoutAdditions = purchase.amount - newAdditionsAmount
  const newPurchaseAmount = calculateNewAmount(purchaseAmountWithoutAdditions, purchase.beneficiaryIds)

  return { ...purchase, amount: newPurchaseAmount + newAdditionsAmount, additions: newAdditions }
}

// ensures that all incomes can be distributed completely
export const calculateNewIncome = (income: Income): Income => {
  const newIncomeAmount = calculateNewAmount(income.amount, income.beneficiaryIds)
  return { ...income, amount: newIncomeAmount }
}
