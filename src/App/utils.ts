import { ClassValue, clsx } from 'clsx'
import { produce } from 'immer'
import {
  both,
  curryN,
  find,
  findIndex,
  gt,
  identical,
  includes,
  last,
  lt,
  map,
  pipe,
  propEq,
  reduce,
  type,
} from 'ramda'
import { twMerge } from 'tailwind-merge'
import { Compensation, Group, Income, Member, Purchase } from '../stores/types'
import { MemberWithAmounts } from './types'

// From ramda-adjunct
const isNumber = curryN(1, pipe(type, identical('Number')))
export const isPositive = both(isNumber, lt(0))
export const isNegative = curryN(1, both(isNumber, gt(0)))

export const findItem = <T extends { id: string }>(id: string, array: T[]): T => find(propEq(id, 'id'), array)!

export const findItems = <T extends { id: string }>(ids: string[], array: T[]) => map(id => findItem(id, array), ids)

export const findItemIndex = <T extends { id: string }>(id: string, array: T[]) => findIndex(propEq(id, 'id'), array)

export const deleteItem = <T extends { id: string }>(id: string, array: T[]) =>
  produce(array, draft => {
    const index = findItemIndex(id, draft)
    if (index === -1) return
    draft.splice(index, 1)
  })

export const getTotalAmountFromArray = <T extends { amount: number }>(array: T[]) =>
  reduce((total, { amount }) => total + amount, 0, array)

export const isLast = <T>(current: T, array: T[]) => current === last(array)

export const displayCurrencyValue = (value: number) =>
  (value / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })

export const displayCurrencyValueNoSign = (value: number) => displayCurrencyValue(value).slice(0, -2)

export const calculateGroupTotalAmount = (purchases: Purchase[], incomes: Income[]) =>
  getTotalAmountFromArray(purchases) - getTotalAmountFromArray(incomes)

const calculatePurchaseAmounts = (memberId: string, purchases: Purchase[]) => {
  let purchaseCurrent = 0
  let purchasesTotal = 0
  purchases.forEach(({ purchaserId, beneficiaryIds, amount, additions, memberAmount }) => {
    additions.forEach(addition => {
      if (includes(memberId, addition.payerIds)) {
        purchaseCurrent += -addition.memberAmount
      }
    })
    if (memberId === purchaserId) {
      purchaseCurrent += amount
      purchasesTotal += amount
    }
    if (includes(memberId, beneficiaryIds)) {
      purchaseCurrent += -memberAmount
    }
  })
  return { purchaseCurrent, purchasesTotal }
}

const calculateIncomeAmounts = (memberId: string, incomes: Income[]) => {
  let incomesCurrent = 0
  let incomesTotal = 0
  incomes.forEach(({ earnerId, beneficiaryIds, amount, memberAmount }) => {
    if (memberId === earnerId) {
      incomesCurrent += -amount
      incomesTotal += -amount
    }
    if (includes(memberId, beneficiaryIds)) {
      incomesCurrent += memberAmount
    }
  })
  return { incomesCurrent, incomesTotal }
}

const calculateCompensationAmount = (memberId: string, compensations: Compensation[]) => {
  let compensationsCurrent = 0
  compensations.forEach(({ payerId, receiverId, amount }) => {
    if (memberId === payerId) {
      compensationsCurrent += amount
    }
    if (memberId === receiverId) {
      compensationsCurrent += -amount
    }
  })
  return compensationsCurrent
}

export const calculateMembersWithAmounts = (
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) =>
  members.map(member => {
    const { purchaseCurrent, purchasesTotal } = calculatePurchaseAmounts(member.id, purchases)
    const { incomesCurrent, incomesTotal } = calculateIncomeAmounts(member.id, incomes)
    const compensationAmount = calculateCompensationAmount(member.id, compensations)
    const current = purchaseCurrent + incomesCurrent + compensationAmount
    const total = purchasesTotal + incomesTotal + compensationAmount
    return produce(member as MemberWithAmounts, draft => {
      draft['current'] = current
      draft['total'] = total
    })
  })

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

function checkPropertyNotZero<T>(array: T[], property: keyof T) {
  return reduce((acc, object) => acc || object[property] !== 0, false, array)
}

export function isGroupActive({ members, purchases, incomes, compensations }: Group) {
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)
  return checkPropertyNotZero(membersWithAmounts, 'current')
}
