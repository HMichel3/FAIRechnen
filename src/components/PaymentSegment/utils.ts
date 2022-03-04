import { difference, includes, isEmpty, isNil, join, map, prop } from 'ramda'
import { Purchase, Compensation, Income, CompleteMember, Addition } from '../../App/types'

type Payment = Purchase | Compensation | Income

export const isPurchase = (payment: Payment): payment is Purchase => !isNil((payment as Purchase).purchaseId)

export const isIncome = (payment: Payment): payment is Income => !isNil((payment as Income).incomeId)

export const displayBeneficiaryNames = (
  beneficiaries: CompleteMember[],
  groupMembers: CompleteMember[],
  additionPayers?: CompleteMember[]
) => {
  const isForAllMembers = isEmpty(difference(groupMembers, beneficiaries))
  if (isForAllMembers) return 'Alle'
  let beneficiaryNames = map(prop('name'), beneficiaries)
  if (!isNil(additionPayers) && !isEmpty(additionPayers)) {
    const additionsPayerNamesWithBrackets = additionPayers.map(({ name }) => `(${name})`)
    beneficiaryNames = beneficiaryNames.concat(additionsPayerNamesWithBrackets)
  }
  return join(', ', beneficiaryNames)
}

export const displayAdditionQuantity = (additionQuantity: number) =>
  additionQuantity === 1 ? '1 Zusatz' : `${additionQuantity} Zusätze`

export const filterGroupPayments = (
  payments: Payment[],
  showPurchases: boolean,
  showIncomes: boolean,
  showCompensations: boolean
) =>
  payments.filter(payment => {
    if (isPurchase(payment)) {
      return showPurchases && payment
    }
    if (isIncome(payment)) {
      return showIncomes && payment
    }
    return showCompensations && payment
  })

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
