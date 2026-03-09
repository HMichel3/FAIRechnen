import { isEmpty, isString } from 'remeda'
import { Payment } from '../types/common'
import { Addition, Compensation, Group, Income, Purchase } from '../types/store'
import { calculateMembersWithAmounts } from './calculation'
import { normalizeString } from './common'

const isMemberInAdditions = (memberId: string, additions: Addition[]) =>
  additions.some(({ payerIds }) => payerIds.includes(memberId))

const isMemberInPurchases = (memberId: string, purchases: Purchase[]) =>
  purchases.some(
    ({ purchaserId, beneficiaryIds, additions }) =>
      purchaserId === memberId || beneficiaryIds.includes(memberId) || isMemberInAdditions(memberId, additions)
  )

const isMemberInIncomes = (memberId: string, incomes: Income[]) =>
  incomes.some(({ earnerId, beneficiaryIds }) => earnerId === memberId || beneficiaryIds.includes(memberId))

const isMemberInCompensations = (memberId: string, compensations: Compensation[]) =>
  compensations.some(({ payerId, receiverId }) => payerId === memberId || receiverId === memberId)

export const isMemberInvolved = (
  memberId: string,
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) =>
  isMemberInPurchases(memberId, purchases) ||
  isMemberInIncomes(memberId, incomes) ||
  isMemberInCompensations(memberId, compensations)

export const isPurchase = (payment: Payment): payment is Purchase => 'purchaserId' in payment

export const isIncome = (payment: Payment): payment is Income => 'earnerId' in payment

export const isCompensation = (payment: Payment): payment is Compensation => 'payerId' in payment

export const isLast = <T>(index: number, array: T[]) => index === array.length - 1

export const isFirst = (index: number) => index === 0

export const isEmptyString = (value: string) => isEmpty(value.trim())

export const isNotEmptyString = (value: string | undefined): value is string =>
  isString(value) && value.trim().length > 0

export const isIdInArray = <T extends { id: string }>(id: string, array: T[]) => array.some(item => item.id === id)

export function isNameInArray<T extends { name: string; id: string }>(
  name: string,
  array: T[],
  excludeId: string
): boolean

export function isNameInArray<T extends { name: string }>(name: string, array: T[]): boolean

export function isNameInArray<T extends { name: string; id?: string }>(name: string, array: T[], excludeId?: string) {
  const normalizedTarget = normalizeString(name)
  return array.some(item => {
    if (excludeId && item.id === excludeId) return false
    return normalizeString(item.name) === normalizedTarget
  })
}

function hasNonZeroProperty<T>(array: T[], property: keyof T) {
  return array.some(object => object[property] !== 0)
}

export const isGroupActive = ({ members, purchases, incomes, compensations }: Group) => {
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)
  return hasNonZeroProperty(membersWithAmounts, 'current')
}
