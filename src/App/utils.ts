import { filter, find, findIndex, last, map, propEq, reduce, reject, update } from 'ramda'

export const findItemById = <T>(id: string, array: T[], idName: keyof T) => find(propEq(idName as string, id), array)!

export const findItemsById = <T>(id: string, array: T[], idName: keyof T) => filter(propEq(idName as string, id), array)

export const findItemsByIds = <T>(ids: string[], array: T[], idName: keyof T) =>
  map(id => findItemById(id, array, idName), ids)

/**
 * Removes one or multiple items, based on the id.
 */
export const removeItemsById = <T>(id: string, array: T[], idName: keyof T) =>
  reject(propEq(idName as string, id), array)

export const updateArrayItemById = <T>(id: string, newItem: T, array: T[], idName: keyof T) =>
  update(findIndex(propEq(idName as string, id), array), newItem, array)

export const getTotalAmountFromArray = <T extends { amount: number }>(array: T[]) =>
  reduce((total, { amount }) => total + amount, 0, array)

export const isLast = <T>(current: T, array: T[]) => current === last(array)

export const displayCurrencyValue = (value: number) =>
  (value / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })

export const addIdToBeneficiariesIfNeeded = (id: string, beneficiaryIds: string[], condition: boolean) =>
  condition ? beneficiaryIds : [id, ...beneficiaryIds]
