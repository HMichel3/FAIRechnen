import { GetState, SetState } from 'zustand'
import { Group, Income } from '../../App/types'
import { findItemsById, removeItemById, removeItemsById, updateArrayItemById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'
import { calculateNewIncome } from '../utils'

export interface IncomeSlice {
  incomes: Income[]
  addIncome: (income: Income) => void
  editIncome: (newIncome: Income) => void
  deleteIncome: (incomeId: Income['incomeId']) => void
  deleteGroupIncomes: (groupId: Group['groupId']) => void
  getGroupIncomes: (groupId: Group['groupId']) => Income[]
}

export const createIncomeSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): IncomeSlice => ({
  incomes: [],
  addIncome: income => set(s => ({ incomes: [...s.incomes, calculateNewIncome(income)] })),
  editIncome: newIncome =>
    set(s => ({
      incomes: updateArrayItemById(newIncome.incomeId, calculateNewIncome(newIncome), s.incomes, 'incomeId'),
    })),
  deleteIncome: incomeId => set(s => ({ incomes: removeItemById(incomeId, s.incomes, 'incomeId') })),
  deleteGroupIncomes: groupId => set(s => ({ incomes: removeItemsById(groupId, s.incomes, 'groupId') })),
  getGroupIncomes: groupId => findItemsById(groupId, get().incomes, 'groupId'),
})
