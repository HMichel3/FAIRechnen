import { sort, descend, prop } from 'ramda'
import { Purchase, Income, Compensation, Member, CompleteMember } from '../App/types'
import { getTotalAmountFromArray } from '../App/utils'

type PurchaseAmounts = {
  purchasesCurrent: Map<string, number>
  purchasesTotal: Map<string, number>
}

type IncomeAmounts = {
  incomesCurrent: Map<string, number>
  incomesTotal: Map<string, number>
}

export const calculateGroupTotalAmount = (purchases: Purchase[], incomes: Income[]) =>
  getTotalAmountFromArray(purchases) - getTotalAmountFromArray(incomes)

const getMapValue = (key: string, map: Map<string, number>) => map.get(key) ?? 0

export const calculatePurchaseAmounts = (purchases: Purchase[]): PurchaseAmounts => {
  const purchasesCurrent = new Map<string, number>()
  const purchasesTotal = new Map<string, number>()
  purchases.forEach(({ purchaserId, beneficiaryIds, amount, additions }) => {
    purchasesTotal.set(purchaserId, getMapValue(purchaserId, purchasesTotal) + amount)
    purchasesCurrent.set(purchaserId, getMapValue(purchaserId, purchasesCurrent) + amount)
    let additionsTotal = 0
    additions.forEach(({ payerIds, amount }) => {
      additionsTotal += amount
      payerIds.forEach(payerId => {
        purchasesCurrent.set(payerId, getMapValue(payerId, purchasesCurrent) - amount / payerIds.length)
      })
    })
    const purchaseAmount = amount - additionsTotal
    const memberAmount = purchaseAmount / beneficiaryIds.length
    beneficiaryIds.forEach(beneficiaryId => {
      purchasesCurrent.set(beneficiaryId, getMapValue(beneficiaryId, purchasesCurrent) - memberAmount)
    })
  })

  return { purchasesCurrent, purchasesTotal }
}

export const calculateIncomeAmounts = (incomes: Income[]): IncomeAmounts => {
  const incomesCurrent = new Map<string, number>()
  const incomesTotal = new Map<string, number>()
  incomes.forEach(({ earnerId, beneficiaryIds, amount }) => {
    incomesTotal.set(earnerId, getMapValue(earnerId, incomesTotal) - amount)
    incomesCurrent.set(earnerId, getMapValue(earnerId, incomesCurrent) - amount)
    const memberAmount = amount / beneficiaryIds.length
    beneficiaryIds.forEach(beneficiaryId => {
      incomesCurrent.set(beneficiaryId, getMapValue(beneficiaryId, incomesCurrent) + memberAmount)
    })
  })

  return { incomesCurrent, incomesTotal }
}

export const calculateCompensationAmount = (compensations: Compensation[]) => {
  const compensationsAmount = new Map<string, number>() // total and current are the same
  compensations.forEach(({ payerId, receiverId, amount }) => {
    compensationsAmount.set(payerId, getMapValue(payerId, compensationsAmount) + amount)
    compensationsAmount.set(receiverId, getMapValue(receiverId, compensationsAmount) - amount)
  })

  return compensationsAmount
}

export const calculateCompleteMembers = (
  groupMembers: Member[],
  purchaseAmounts: PurchaseAmounts,
  incomeAmounts: IncomeAmounts,
  compensationAmount: Map<string, number>
): CompleteMember[] =>
  groupMembers.map(member => {
    const amount =
      getMapValue(member.memberId, purchaseAmounts.purchasesCurrent) +
      getMapValue(member.memberId, incomeAmounts.incomesCurrent) +
      getMapValue(member.memberId, compensationAmount)
    const totalAmount =
      getMapValue(member.memberId, purchaseAmounts.purchasesTotal) +
      getMapValue(member.memberId, incomeAmounts.incomesTotal) +
      getMapValue(member.memberId, compensationAmount)
    const involved =
      purchaseAmounts.purchasesCurrent.has(member.memberId) ||
      purchaseAmounts.purchasesTotal.has(member.memberId) ||
      incomeAmounts.incomesCurrent.has(member.memberId) ||
      incomeAmounts.incomesTotal.has(member.memberId) ||
      compensationAmount.has(member.memberId)
    return { ...member, amount, totalAmount, involved }
  })

export const mergeAndSortPayments = (purchases: Purchase[], incomes: Income[], compensations: Compensation[]) =>
  sort(descend(prop('timestamp')), [...purchases, ...incomes, ...compensations])
