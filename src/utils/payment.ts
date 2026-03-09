import { filter, flatMap, pipe, prop, sortBy, unique } from 'remeda'
import { Addition, Compensation, Income, Purchase } from '../types/store'

export const mergeAndSortPayments = (purchases: Purchase[], incomes: Income[], compensations: Compensation[]) => {
  const payments = [...purchases, ...incomes, ...compensations]
  return sortBy(payments, [prop('timestamp'), 'desc'])
}

export const getAdditionPayerIdsNotInBeneficiaries = (additions: Addition[], beneficiaryIds: string[]) => {
  return pipe(
    additions,
    flatMap(addition => addition.payerIds),
    unique(),
    filter(payerId => !beneficiaryIds.includes(payerId))
  )
}
