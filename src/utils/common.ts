import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support'
import { maskitoParseNumber } from '@maskito/kit'
import { ClassValue, clsx } from 'clsx'
import { filter, indexBy, isNonNullish, map, pipe, sortBy, sumBy, uniqueBy } from 'remeda'
import { twMerge } from 'tailwind-merge'
import { CompensationWithoutTimestamp } from '../types/common'
import { Income, Member, Purchase } from '../types/store'
import { isNotEmptyString } from './guard'
import { getAdditionPayerIdsNotInBeneficiaries } from './payment'

export const findItem = <T extends { id: string }>(id: string | undefined, array: T[]) =>
  id ? array.find(item => item.id === id) : undefined

export const findItemIndex = <T extends { id: string }>(id: string, array: T[]) =>
  array.findIndex(item => item.id === id)

export const findItemIndexByName = <T extends { name: string }>(name: string, array: T[]): number => {
  const normalizedSearchName = normalizeString(name)
  return array.findIndex(item => normalizeString(item.name) === normalizedSearchName)
}

export const getTotalAmountFromArray = <T extends { amount: number }>(array: T[]) => sumBy(array, item => item.amount)

export const normalizeString = (value: string) => value.toLowerCase().trim()

export const getEuroValue = (value: number) => value / 100

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

const resolveIdsFromMap = <T>(ids: string[], itemMap: Record<string, T | undefined>): T[] =>
  pipe(
    ids,
    map(id => itemMap[id]),
    filter(isNonNullish)
  )

export const getPurchaseInfo = (purchase: Purchase, members: Member[]) => {
  const { purchaserId, beneficiaryIds, additions } = purchase
  const additionPayerIds = getAdditionPayerIdsNotInBeneficiaries(additions, beneficiaryIds)
  const memberMap = indexBy(members, member => member.id)
  return {
    purchaser: purchaserId ? memberMap[purchaserId] : undefined,
    beneficiaries: resolveIdsFromMap(beneficiaryIds, memberMap),
    additionPayers: resolveIdsFromMap(additionPayerIds, memberMap),
  }
}

export const getIncomeInfo = (income: Income, members: Member[]) => {
  const { earnerId, beneficiaryIds } = income
  const memberMap = indexBy(members, member => member.id)
  return {
    earner: earnerId ? memberMap[earnerId] : undefined,
    beneficiaries: resolveIdsFromMap(beneficiaryIds, memberMap),
  }
}

export const getCompensationInfo = (compensation: CompensationWithoutTimestamp, members: Member[]) => {
  const { payerId, receiverId } = compensation
  const memberMap = indexBy(members, member => member.id)
  return {
    payer: payerId ? memberMap[payerId] : undefined,
    receiver: receiverId ? memberMap[receiverId] : undefined,
  }
}

export const determineEdgeToEdge = async () => {
  if (Capacitor.getPlatform() !== 'android') {
    return
  }
  const { osVersion } = await Device.getInfo()
  const version = parseInt(osVersion, 10)
  if (version >= 15) {
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
  array.filter(item => isNotEmptyString(item.name))

export const filterDuplicateNames = <T extends { name: string }>(array: T[]) =>
  uniqueBy(array, item => normalizeString(item.name))

export const rejectById = <T extends { id: string }>(id: string, array: T[]) => array.filter(item => item.id !== id)

export const sortByName = <T extends { name: string }>(array: T[]) => {
  return sortBy(array, item => item.name.toLowerCase())
}

export const parseCommaNumber = (value: string) => maskitoParseNumber(value || '0', ',')
