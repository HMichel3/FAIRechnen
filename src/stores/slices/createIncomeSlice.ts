import { produce } from 'immer'
import { NewIncome } from '../../App/types'
import { findItemIndex } from '../../App/utils'
import { Income } from '../types'
import { PersistImmer } from '../usePersistedStore'
import { calculateNewIncome } from '../utils'

export type IncomeSlice = {
  addIncome: (groupId: string, newIncome: NewIncome) => void
  editIncome: (groupId: string, incomeId: string, newIncome: NewIncome) => void
  deleteIncome: (groupId: string, incomeId: string) => void
}

export const createIncomeSlice: PersistImmer<IncomeSlice> = set => ({
  addIncome: (groupId, newIncome) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groups[groupIndex].incomes.push(
        produce(calculateNewIncome(newIncome) as Income, draft => {
          draft['id'] = crypto.randomUUID()
          draft['timestamp'] = Date.now()
        })
      )
    }),
  editIncome: (groupId, incomeId, newIncome) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const incomeIndex = findItemIndex(incomeId, store.groups[groupIndex].incomes)
      if (incomeIndex === -1) return
      const { name, amount, earnerId, beneficiaryIds, description, memberAmount } = calculateNewIncome(newIncome)
      const income = store.groups[groupIndex].incomes[incomeIndex]
      income.name = name
      income.amount = amount
      income.earnerId = earnerId
      income.beneficiaryIds = beneficiaryIds
      income.description = description
      income.memberAmount = memberAmount
    }),
  deleteIncome: (groupId, incomeId) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const incomeIndex = findItemIndex(incomeId, store.groups[groupIndex].incomes)
      if (incomeIndex === -1) return
      store.groups[groupIndex].incomes.splice(incomeIndex, 1)
    }),
})
