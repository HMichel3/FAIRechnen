import { where, includes, equals, whereAny } from 'ramda'
import { Addition, Compensation, Income, Purchase } from '../../stores/types'

const isMemberInAdditions = (memberId: string, additions: Addition[]) =>
  additions.some(
    where({
      payerIds: includes(memberId),
    })
  )

const isMemberInPurchases = (memberId: string, purchases: Purchase[]) =>
  purchases.some(
    whereAny({
      purchaserId: equals(memberId),
      beneficiaryIds: includes(memberId),
      additions: (additions: Addition[]) => isMemberInAdditions(memberId, additions),
    })
  )

const isMemberInIncomes = (memberId: string, incomes: Income[]) =>
  incomes.some(
    whereAny({
      earnerId: equals(memberId),
      beneficiaryIds: includes(memberId),
    })
  )

const isMemberInCompensations = (memberId: string, compensations: Compensation[]) =>
  compensations.some(
    whereAny({
      payerId: equals(memberId),
      receiverId: equals(memberId),
    })
  )

export const isMemberInvolved = (
  memberId: string,
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) =>
  isMemberInPurchases(memberId, purchases) ||
  isMemberInIncomes(memberId, incomes) ||
  isMemberInCompensations(memberId, compensations)
