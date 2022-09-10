import produce from 'immer'
import { descend, difference, includes, isEmpty, isNil, join, map, prop, sort } from 'ramda'
import { Payment } from '../../App/types'
import { Purchase, Income, Addition, Member, Compensation } from '../../stores/types'

export const isPurchase = (payment: Payment): payment is Purchase => !isNil((payment as Purchase).purchaserId)

export const isIncome = (payment: Payment): payment is Income => !isNil((payment as Income).earnerId)

export const displayBeneficiaryNames = (beneficiaries: Member[], members: Member[], additionPayers?: Member[]) => {
  const isForAllMembers = isEmpty(difference(members, beneficiaries))
  if (isForAllMembers) return 'Alle'
  const beneficiaryNames = map(prop('name'), beneficiaries)
  const completeBeneficiaryNames = produce(beneficiaryNames, draft => {
    if (isNil(additionPayers) || isEmpty(additionPayers)) return
    const beneficiaryNamesWithBrackets = additionPayers.map(({ name }) => `(${name})`)
    draft.push(...beneficiaryNamesWithBrackets)
  })
  return join(', ', completeBeneficiaryNames)
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
