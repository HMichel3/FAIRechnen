import { map, pipe, reduce, sumBy } from 'remeda'
import { MemberWithAmounts } from '../types/common'
import { Compensation, Income, Member, Purchase } from '../types/store'
import { getTotalAmountFromArray } from './common'

export const calculateGroupTotalAmount = (group: { purchases: Purchase[]; incomes: Income[] }) =>
  getTotalAmountFromArray(group.purchases) - getTotalAmountFromArray(group.incomes)

const calculatePurchaseAmounts = (memberId: string, purchases: Purchase[]) =>
  reduce(
    purchases,
    (acc, purchase) => {
      const isPurchaser = purchase.purchaserId === memberId
      const isBeneficiary = purchase.beneficiaryIds.includes(memberId)
      const purchaserImpact = isPurchaser ? purchase.amount : 0
      const beneficiaryImpact = isBeneficiary ? -purchase.memberAmount : 0
      const additionsImpact = -sumBy(purchase.additions, a => (a.payerIds.includes(memberId) ? a.memberAmount : 0))
      return {
        purchaseCurrent: acc.purchaseCurrent + purchaserImpact + beneficiaryImpact + additionsImpact,
        purchasesTotal: acc.purchasesTotal + purchaserImpact,
      }
    },
    { purchaseCurrent: 0, purchasesTotal: 0 }
  )

const calculateIncomeAmounts = (memberId: string, incomes: Income[]) =>
  reduce(
    incomes,
    (acc, income) => {
      const isEarner = income.earnerId === memberId
      const isBeneficiary = income.beneficiaryIds.includes(memberId)
      const earnerImpact = isEarner ? -income.amount : 0
      const beneficiaryImpact = isBeneficiary ? income.memberAmount : 0
      return {
        incomesCurrent: acc.incomesCurrent + earnerImpact + beneficiaryImpact,
        incomesTotal: acc.incomesTotal + earnerImpact,
      }
    },
    { incomesCurrent: 0, incomesTotal: 0 }
  )

const calculateCompensationAmount = (memberId: string, compensations: Compensation[]) =>
  sumBy(compensations, ({ payerId, receiverId, amount }) => {
    const payerImpact = memberId === payerId ? amount : 0
    const receiverImpact = memberId === receiverId ? -amount : 0
    return payerImpact + receiverImpact
  })

export const calculateMembersWithAmounts = (
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
): MemberWithAmounts[] =>
  pipe(
    members,
    map(member => {
      const { purchaseCurrent, purchasesTotal } = calculatePurchaseAmounts(member.id, purchases)
      const { incomesCurrent, incomesTotal } = calculateIncomeAmounts(member.id, incomes)
      const compensationAmount = calculateCompensationAmount(member.id, compensations)
      return {
        ...member,
        current: purchaseCurrent + incomesCurrent + compensationAmount,
        total: purchasesTotal + incomesTotal + compensationAmount,
      }
    })
  )
