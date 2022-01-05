import { any, includes, map, equals, or, flatten, prop, concat, all, and, append } from 'ramda'
import { Addition, Compensation, Member, Purchase } from '../App/types'
import { checkIfIdIsInArray } from '../App/utils'

const checkIfIdIsInBeneficiaryIds = <Type extends { id: string; beneficiaryIds: string[] }>(
  id: Type['id'],
  array: Omit<Type, 'id'>[]
) => any(({ beneficiaryIds }) => includes(id, beneficiaryIds), array)

export const checkIfBeneficiaryIsInvolved = (memberId: Member['id'], purchases: Purchase[]) => {
  const resultOne = checkIfIdIsInBeneficiaryIds(memberId, purchases)
  const resultArray = map(({ additions }) => checkIfIdIsInBeneficiaryIds(memberId, additions), purchases)
  const resultTwo = any(equals(true), resultArray)
  return or(resultOne, resultTwo)
}

export const checkPurchaseParticipation = (memberId: Member['id'], purchases: Purchase[]) => {
  const isPurchaserInvolved = checkIfIdIsInArray(memberId, purchases, 'purchaserId')
  const isBeneficiaryInvolved = checkIfBeneficiaryIsInvolved(memberId, purchases)
  return or(isPurchaserInvolved, isBeneficiaryInvolved)
}

export const checkIfAllPurchaseInvolvedExist = (
  purchasePurchaserId: Purchase['purchaserId'],
  purchaseBeneficiaryIds: Purchase['beneficiaryIds'],
  members: Member[]
) => {
  const isPurchaserExisting = checkIfIdIsInArray(purchasePurchaserId, members)
  const areBeneficiariesExisting = all(
    beneficiaryId => checkIfIdIsInArray(beneficiaryId, members),
    purchaseBeneficiaryIds
  )
  return and(isPurchaserExisting, areBeneficiariesExisting)
}

export const checkCompensationParticipation = (memberId: Member['id'], compensations: Compensation[]) => {
  const isPayerInvolved = checkIfIdIsInArray(memberId, compensations, 'payerId')
  const isReceiverInvolved = checkIfIdIsInArray(memberId, compensations, 'receiverId')
  return or(isPayerInvolved, isReceiverInvolved)
}

export const checkIfAllCompensationInvolvedExist = (
  compensationPayerId: Compensation['payerId'],
  compensationReceiverId: Compensation['receiverId'],
  members: Member[]
) => {
  const isPayerExisting = checkIfIdIsInArray(compensationPayerId, members)
  const isReceiverExisting = checkIfIdIsInArray(compensationReceiverId, members)
  return and(isPayerExisting, isReceiverExisting)
}

export const getAllBeneficiaryIdsFromPurchase = (
  purchaseBeneficiaryIds: Purchase['beneficiaryIds'],
  purchaseAdditions: Addition[]
) => {
  const additionBeneficiaryIds = flatten(map(prop('beneficiaryIds'), purchaseAdditions))
  const allBeneficiaryIds = concat(purchaseBeneficiaryIds, additionBeneficiaryIds)
  // removes duplicates
  return [...new Set(allBeneficiaryIds)]
}

export const addPurchaserToBeneficiariesIfNeeded = ({
  purchaserId,
  beneficiaryIds,
  isPurchaserOnlyPaying,
}: Pick<Purchase, 'isPurchaserOnlyPaying' | 'beneficiaryIds' | 'purchaserId'>) =>
  isPurchaserOnlyPaying ? beneficiaryIds : append(purchaserId, beneficiaryIds)
