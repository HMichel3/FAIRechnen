import {
  add,
  any,
  concat,
  descend,
  eqProps,
  equals,
  filter,
  find,
  findIndex,
  forEach,
  includes,
  isEmpty,
  isNil,
  last,
  map,
  prop,
  propEq,
  reduce,
  reject,
  sort,
  update,
} from 'ramda'
import { isPositive } from 'ramda-adjunct'
import { compensationDTO } from '../dtos/compensationDTO'
import { Purchase, Compensation, Group, Member } from './types'

export const getArrayItemById = <Type extends { id: string }>(id: Type['id'], array: Type[]) =>
  find(propEq('id', id), array)!

export const getArrayItemsByGroupId = <Type extends { id: string }>(
  id: Type['id'],
  array: Type[],
  idName = 'groupId'
) => filter(propEq(idName, id), array)

export const getArrayItemsByIds = <Type extends { id: string }>(ids: Type['id'][], array: Type[]) =>
  filter(item => includes(item.id, ids), array)

export const mergeAndSortArraysByTimestamp = <Type1 extends { timestamp: number }, Type2 extends { timestamp: number }>(
  array1: Type1[],
  array2: Type2[]
) => {
  const mergedArrays = concat(array1, array2)
  return sort(descend(prop('timestamp')), mergedArrays)
}

export const removeArrayItemsById = <Type extends { id: string }>(id: Type['id'], array: Type[], idName = 'id') =>
  reject(propEq(idName, id), array)

export const checkIfIdIsInArray = <Type extends { id: string }>(id: Type['id'], array: Type[], idName = 'id') =>
  any(propEq(idName, id), array)

export const updateArrayItemById = <Type extends { id: string }>(id: Type['id'], newItem: Type, array: Type[]) => {
  const purchaseIndex = findIndex(propEq('id', id), array)
  return update(purchaseIndex, newItem, array)
}

export const displayCurrencyValue = (value: number) =>
  (value / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })

export const getTotalAmountFromArray = <Type extends { amount: number }>(array: Type[]) => {
  const amounts = map(prop('amount'), array)
  return reduce(add, 0, amounts)
}

export const isPurchase = (item: Purchase | Compensation): item is Purchase => !isNil((item as Purchase).name)

export const removeDuplicateCompensations = (array: Compensation[]) => {
  const findSecondObj = (firstObj: Compensation) =>
    find(secondObj => eqProps('payerId', secondObj, firstObj) && eqProps('receiverId', secondObj, firstObj), array)

  return filter(firstObj => equals(firstObj, findSecondObj(firstObj)), array)
}

export const equalsLast = <T>(current: T, array: T[]) => current === last(array)

export const generatePossibleCompensations = (groupId: Group['id'], groupMembers: Member[]) => {
  // filter groupMembers, to only contain members with amount !== 0, continue if at least 2 members are left
  const possibleGroupMembers = filter(member => !equals(member.amount, 0), groupMembers)
  if (possibleGroupMembers.length < 2) return []
  let compensations: Compensation[] = []
  let partner: Member
  forEach(member => {
    let minAmountDiff: number
    forEach(secondMember => {
      if (Math.sign(member.amount) === Math.sign(secondMember.amount)) return
      const amountDiff = member.amount + secondMember.amount
      if (amountDiff >= minAmountDiff) return
      minAmountDiff = amountDiff
      partner = secondMember
    }, removeArrayItemsById(member.id, possibleGroupMembers))
    const compensationAmount = Math.min(Math.abs(member.amount), Math.abs(partner.amount))
    if (isPositive(member.amount)) {
      return compensations.push(compensationDTO(groupId, compensationAmount, partner.id, member.id))
    }
    compensations.push(compensationDTO(groupId, compensationAmount, member.id, partner.id))
  }, possibleGroupMembers)
  const compensationsWithoutDuplicates = removeDuplicateCompensations(compensations)
  const sortedCompensations = sort(descend(prop('amount')), compensationsWithoutDuplicates)
  return sortedCompensations
}

export const generateOnePossibleCompensationChain = (groupId: Group['id'], groupMembers: Member[]) => {
  let theoreticallyGroupMembers = groupMembers
  const theoreticallyAddedCompensations: Compensation[] = []

  const theoreticallyEditMemberAmount = (memberId: Member['id'], amount: Compensation['amount']) => {
    const member = getArrayItemById(memberId, theoreticallyGroupMembers)
    const newMember = { ...member, amount: member.amount + amount }
    theoreticallyGroupMembers = updateArrayItemById(memberId, newMember, theoreticallyGroupMembers)
  }

  const theoreticallyAdjustCompensationAmountOnMembers = (
    amount: Compensation['amount'],
    payerId: Compensation['payerId'],
    receiverId: Compensation['receiverId']
  ) => {
    theoreticallyEditMemberAmount(payerId, amount)
    theoreticallyEditMemberAmount(receiverId, -amount)
  }

  const theoreticallyAddCompensation = (compensation: Compensation) => {
    const { amount, payerId, receiverId } = compensation
    theoreticallyAdjustCompensationAmountOnMembers(amount, payerId, receiverId)
    theoreticallyAddedCompensations.push(compensation)
  }

  for (let result; (result = generatePossibleCompensations(groupId, theoreticallyGroupMembers)); ) {
    if (isEmpty(result)) break
    theoreticallyAddCompensation(result[0])
  }

  return theoreticallyAddedCompensations
}

export const calculateMemberTotalAmount = (
  memberId: Member['id'],
  groupPurchases: Purchase[],
  groupCompensations: Compensation[]
) => {
  const memberPurchases = getArrayItemsByGroupId(memberId, groupPurchases, 'purchaserId')
  const memberPayedCompensations = getArrayItemsByGroupId(memberId, groupCompensations, 'payerId')
  const memberReceivedCompensations = getArrayItemsByGroupId(memberId, groupCompensations, 'receiverId')
  const memberPurchasesTotalAmount = getTotalAmountFromArray(memberPurchases)
  const memberPayedTotalAmount = getTotalAmountFromArray(memberPayedCompensations)
  const memberReceivedTotalAmount = getTotalAmountFromArray(memberReceivedCompensations)
  return memberPurchasesTotalAmount + memberPayedTotalAmount - memberReceivedTotalAmount
}
