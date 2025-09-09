import { descend, difference, includes, isEmpty, isNotNil, join, map, prop, sort } from 'ramda'
import { Payment } from '../../App/types'
import { Addition, Compensation, Income, Member, Purchase } from '../../stores/types'

export const isPurchase = (payment: Payment): payment is Purchase => isNotNil((payment as Purchase).purchaserId)

export const isIncome = (payment: Payment): payment is Income => isNotNil((payment as Income).earnerId)

export const displayBeneficiaryNames = (beneficiaries: Member[], members: Member[], additionPayers?: Member[]) => {
  const isForAllMembers = isEmpty(difference(members, beneficiaries))
  if (isForAllMembers) return 'Alle'
  const beneficiaryNames = map(prop('name'), beneficiaries)
  const additionalNames = additionPayers?.map(({ name }) => `(${name})`) ?? []
  return join(', ', [...beneficiaryNames, ...additionalNames])
}

export const displayAdditionQuantity = (additionQuantity: number) =>
  additionQuantity === 1 ? '1 Zusatz' : `${additionQuantity} Zusätze`

export const mergeAndSortPayments = (purchases: Purchase[], incomes: Income[], compensations: Compensation[]) => {
  const payments = [...purchases, ...incomes, ...compensations]
  return sort(descend(prop('timestamp')), payments)
}

export const getAdditionPayerIdsNotInBeneficiaries = (additions: Addition[], beneficiaryIds: string[]) => {
  const additionPayerIdsSet = new Set<string>() // filters duplicates
  additions.forEach(({ payerIds }) => {
    payerIds.forEach(payerId => {
      if (includes(payerId, beneficiaryIds)) return
      additionPayerIdsSet.add(payerId)
    })
  })
  return [...additionPayerIdsSet]
}
