import { NewIncome } from '../../App/types'
import { findItem, rejectById } from '../../App/utils'
import { PersistImmer } from '../usePersistedStore'
import { calculateNewIncome, withMetaData } from '../utils'

export type IncomeSlice = {
  addIncome: (groupId: string, newIncome: NewIncome) => void
  editIncome: (groupId: string, incomeId: string, newIncome: NewIncome) => void
  deleteIncome: (groupId: string, incomeId: string) => void
}

export const createIncomeSlice: PersistImmer<IncomeSlice> = set => ({
  addIncome: (groupId, newIncome) =>
    set(store => {
      const foundGroup = findItem(groupId, store.groups)
      if (!foundGroup) return
      const income = withMetaData(calculateNewIncome(newIncome))
      foundGroup.incomes.push(income)
    }),
  editIncome: (groupId, incomeId, newIncome) =>
    set(store => {
      const foundGroup = findItem(groupId, store.groups)
      if (!foundGroup) return
      const foundIncome = findItem(incomeId, foundGroup.incomes)
      if (!foundIncome) return
      Object.assign(foundIncome, calculateNewIncome(newIncome))
    }),
  deleteIncome: (groupId, incomeId) =>
    set(store => {
      const foundGroup = findItem(groupId, store.groups)
      if (!foundGroup) return
      foundGroup.incomes = rejectById(incomeId, foundGroup.incomes)
    }),
})
