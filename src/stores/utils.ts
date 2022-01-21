import { any, includes, map, equals, flatten, prop, all } from 'ramda'
import { Addition, Compensation, Income, Member, Purchase } from '../App/types'
import { checkIfIdIsInArray } from '../App/utils'

const checkIfIdIsInBeneficiaryIds = <Type extends { id: string; beneficiaryIds: string[] }>(
  id: Type['id'],
  array: Omit<Type, 'id'>[]
) => any(({ beneficiaryIds }) => includes(id, beneficiaryIds), array)

export const checkIfBeneficiaryIsInvolved = (memberId: Member['id'], purchases: Purchase[]) => {
  const resultOne = checkIfIdIsInBeneficiaryIds(memberId, purchases)
  const resultArray = map(({ additions }) => checkIfIdIsInBeneficiaryIds(memberId, additions), purchases)
  const resultTwo = any(equals(true), resultArray)
  return resultOne || resultTwo
}

export const checkPurchaseParticipation = (memberId: Member['id'], purchases: Purchase[]) => {
  const isPurchaserInvolved = checkIfIdIsInArray(memberId, purchases, 'purchaserId')
  const isBeneficiaryInvolved = checkIfBeneficiaryIsInvolved(memberId, purchases)
  return isPurchaserInvolved || isBeneficiaryInvolved
}

export const checkIncomeParticipation = (memberId: Member['id'], incomes: Income[]) => {
  const isEarnerInvolved = checkIfIdIsInArray(memberId, incomes, 'earnerId')
  const isBeneficiaryInvolved = checkIfIdIsInBeneficiaryIds(memberId, incomes)
  return isEarnerInvolved || isBeneficiaryInvolved
}

export const checkIfAllIdsExistInMembers = (ids: Member['id'][], members: Member[]) =>
  all(id => checkIfIdIsInArray(id, members), ids)

export const checkCompensationParticipation = (memberId: Member['id'], compensations: Compensation[]) => {
  const isPayerInvolved = checkIfIdIsInArray(memberId, compensations, 'payerId')
  const isReceiverInvolved = checkIfIdIsInArray(memberId, compensations, 'receiverId')
  return isPayerInvolved || isReceiverInvolved
}

export const checkIfAllCompensationInvolvedExist = (
  compensationPayerId: Compensation['payerId'],
  compensationReceiverId: Compensation['receiverId'],
  members: Member[]
) => {
  const isPayerExisting = checkIfIdIsInArray(compensationPayerId, members)
  const isReceiverExisting = checkIfIdIsInArray(compensationReceiverId, members)
  return isPayerExisting && isReceiverExisting
}

export const getAllBeneficiaryIdsFromPurchase = (
  purchaseBeneficiaryIds: Purchase['beneficiaryIds'],
  purchaseAdditions: Addition[]
) => {
  const additionBeneficiaryIds = flatten(map(prop('beneficiaryIds'), purchaseAdditions))
  const allBeneficiaryIds = [...purchaseBeneficiaryIds, ...additionBeneficiaryIds]
  // removes duplicates
  return [...new Set(allBeneficiaryIds)]
}

export const addPurchaserToBeneficiariesIfNeeded = ({
  purchaserId,
  beneficiaryIds,
  isPurchaserOnlyPaying,
}: Pick<Purchase, 'isPurchaserOnlyPaying' | 'beneficiaryIds' | 'purchaserId'>) =>
  isPurchaserOnlyPaying ? beneficiaryIds : [...beneficiaryIds, purchaserId]

export const addEarnerToBeneficiariesIfNeeded = ({
  earnerId,
  beneficiaryIds,
  isEarnerOnlyEarning,
}: Pick<Income, 'earnerId' | 'beneficiaryIds' | 'isEarnerOnlyEarning'>) =>
  isEarnerOnlyEarning ? beneficiaryIds : [...beneficiaryIds, earnerId]
