import { difference, isEmpty, isNil, join, map, prop } from 'ramda'
import { Purchase, Compensation, Income, CompleteMember } from '../../App/types'

type Payment = Purchase | Compensation | Income

export const isPurchase = (payment: Payment): payment is Purchase => !isNil((payment as Purchase).purchaseId)

export const isIncome = (payment: Payment): payment is Income => !isNil((payment as Income).incomeId)

export const displayBeneficiaryNames = (beneficiaries: CompleteMember[], groupMembers: CompleteMember[]) => {
  const isForAllMembers = isEmpty(difference(groupMembers, beneficiaries))
  const involvedMemberNames = map(prop('name'), beneficiaries)
  const involvedMemberNamesSeparated = join(', ', involvedMemberNames)
  return isForAllMembers ? 'Alle' : involvedMemberNamesSeparated
}

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
