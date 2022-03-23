// @ts-ignore: needed because whereAny not in ramda types yet
import { curry, where, includes, equals, whereAny } from 'ramda'
import { Addition, Purchase, Income, Compensation } from '../../stores/types'

const isMemberInAdditions = curry((memberId: string, additions: Addition[]) =>
  additions.some(
    where({
      payerIds: includes(memberId),
    })
  )
)

const isMemberInPurchases = (memberId: string, purchases: Purchase[]) =>
  purchases.some(
    whereAny({
      purchaserId: equals(memberId),
      beneficiaryIds: includes(memberId),
      additions: isMemberInAdditions(memberId),
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
