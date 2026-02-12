import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support'
import { ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { produce } from 'immer'
import {
  any,
  both,
  compose,
  curryN,
  defaultTo,
  filter,
  find,
  findIndex,
  gt,
  identical,
  includes,
  isNotEmpty,
  isNotNil,
  lt,
  map,
  pipe,
  prop,
  propEq,
  reduce,
  reject,
  sortBy,
  toLower,
  trim,
  type,
  uniqBy,
} from 'ramda'
import { twMerge } from 'tailwind-merge'
import { getAdditionPayerIdsNotInBeneficiaries } from '../components/PaymentSegment/utils'
import { Compensation, Group, Income, Member, Purchase } from '../stores/types'
import { CompensationWithoutTimestamp, MemberWithAmounts } from './types'

// From ramda-adjunct
const isNumber = curryN(1, pipe(type, identical('Number') as (value: string) => boolean))
export const isPositive = both(isNumber, lt(0))
export const isNegative = curryN(1, both(isNumber, gt(0)))

export const findItem = <T extends { id: string }>(id: string, array: T[]) => find(propEq(id, 'id'), array)

export const findItems = <T extends { id: string }>(ids: string[], array: T[]) =>
  map(id => findItem(id, array), ids).filter(isNotNil)

export const findItemIndex = <T extends { id: string }>(id: string, array: T[]) => findIndex(propEq(id, 'id'), array)

export const findItemIndexByName = <T extends { name: string }>(name: string, array: T[]) =>
  findIndex(item => normalizeString(item.name) === normalizeString(name), array)

export const deleteItem = <T extends { id: string }>(id: string, array: T[]) =>
  produce(array, draft => {
    const index = findItemIndex(id, draft)
    if (index === -1) return
    draft.splice(index, 1)
  })

export const getTotalAmountFromArray = <T extends { amount: number }>(array: T[]) =>
  reduce((total, { amount }) => total + amount, 0, array)

export const isLast = <T>(index: number, array: T[]) => index === array.length - 1

export const isFirst = (index: number) => index === 0

export const normalizeString = pipe(defaultTo(''), toLower, trim)

export const isNotEmptyString = pipe(normalizeString, isNotEmpty) as (
  value: string | null | undefined
) => value is string

export const isIdInArray = <T extends { id: string }>(id: string, array: T[]) => any(propEq(id, 'id'), array)

export function isNameInArray<T extends { name: string; id: string }>(
  name: string,
  array: T[],
  excludeId: string
): boolean

export function isNameInArray<T extends { name: string }>(name: string, array: T[]): boolean

export function isNameInArray<T extends { name: string; id?: string }>(name: string, array: T[], excludeId?: string) {
  const normalizedTarget = normalizeString(name)
  return any(item => {
    if (excludeId && item.id === excludeId) return false
    return normalizeString(item.name) === normalizedTarget
  }, array)
}

export const displayCurrencyValue = (value: number) =>
  (value / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })

export const getEuroValue = (value: number) => value / 100

export const displayCurrencyValueNoSign = (value: number) => displayCurrencyValue(value).slice(0, -2)

export const displayTimestamp = (timestamp: number, options?: { noYear?: boolean; noTime?: boolean }) => {
  let formatString = 'dd.MM.y, HH:mm'
  if (options?.noYear) {
    formatString = 'dd.MM. • HH:mm'
  }
  if (options?.noTime) {
    formatString = 'dd.MM.y'
  }
  return format(timestamp, formatString, { locale: de })
}

export const calculateGroupTotalAmount = (group: { purchases: Purchase[]; incomes: Income[] }) =>
  getTotalAmountFromArray(group.purchases) - getTotalAmountFromArray(group.incomes)

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
): MemberWithAmounts[] =>
  members.map(member => {
    const { purchaseCurrent, purchasesTotal } = calculatePurchaseAmounts(member.id, purchases)
    const { incomesCurrent, incomesTotal } = calculateIncomeAmounts(member.id, incomes)
    const compensationAmount = calculateCompensationAmount(member.id, compensations)
    const current = purchaseCurrent + incomesCurrent + compensationAmount
    const total = purchasesTotal + incomesTotal + compensationAmount
    return { ...member, current, total }
  })

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

function checkPropertyNotZero<T>(array: T[], property: keyof T) {
  return reduce((acc, object) => acc || object[property] !== 0, false, array)
}

export const isGroupActive = ({ members, purchases, incomes, compensations }: Group) => {
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)
  return checkPropertyNotZero(membersWithAmounts, 'current')
}

export const getPurchaseInfo = (purchase: Purchase, members: Member[]) => {
  const { purchaserId, beneficiaryIds, additions } = purchase
  const additionPayerIds = getAdditionPayerIdsNotInBeneficiaries(additions, beneficiaryIds)
  const purchaser = findItem(purchaserId, members)
  const beneficiaries = findItems(beneficiaryIds, members)
  const additionPayers = findItems(additionPayerIds, members)
  return { purchaser, beneficiaries, additionPayers }
}

export const getIncomeInfo = (income: Income, members: Member[]) => {
  const { earnerId, beneficiaryIds } = income
  const earner = findItem(earnerId, members)
  const beneficiaries = findItems(beneficiaryIds, members)
  return { earner, beneficiaries }
}

export const getCompensationInfo = (compensation: CompensationWithoutTimestamp, members: Member[]) => {
  const { payerId, receiverId } = compensation
  const payer = findItem(payerId, members)
  const receiver = findItem(receiverId, members)
  return { payer, receiver }
}

export const determineEdgeToEdge = async () => {
  if (Capacitor.getPlatform() !== 'android') return
  const { osVersion } = await Device.getInfo()
  if (Number(osVersion) >= 15) {
    await EdgeToEdge.enable() // Enable only on Android 15+
  } else {
    await EdgeToEdge.disable() // Prevents layout issues on older Android versions
  }
}

export const parseError = (error: unknown) => {
  return error instanceof Error ? error : new Error(String(error))
}

export const createFileName = (name: string, extension: 'pdf' | 'json') =>
  `FAIRechnen_${name.replace(/\s/g, '_')}.${extension}`

export const filterNonEmptyNames = <T extends { name: string }>(array: T[]) =>
  filter(item => isNotEmptyString(item.name), array)

export const filterDuplicateNames = <T extends { name: string }>(array: T[]) =>
  uniqBy(({ name }) => normalizeString(name), array)

export const rejectById = <T extends { id: string }>(id: string, array: T[]) => reject(propEq(id, 'id'), array)

export const sortByName = <T extends { name: string }>(array: T[]) => sortBy(compose(toLower, prop('name')), array)
