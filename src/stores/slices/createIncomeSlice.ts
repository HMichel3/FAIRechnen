import produce from 'immer'
import { SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'
import { calculateNewIncome } from '../utils'
import { v4 as uuid } from 'uuid'
import { NewIncome } from '../../App/types'
import { findItemIndex } from '../../App/utils'
import { Income } from '../types'

export interface IncomeSlice {
  addIncome: (groupId: string, newIncome: NewIncome) => void
  editIncome: (groupId: string, incomeId: string, newIncome: NewIncome) => void
  deleteIncome: (groupId: string, incomeId: string) => void
  deleteGroupIncomes: (groupId: string) => void
}

export const createIncomeSlice = (set: SetState<PersistedState>): IncomeSlice => ({
  addIncome: (groupId, newIncome) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        store.groups[groupIndex].incomes.push(
          produce(calculateNewIncome(newIncome) as Income, draft => {
            draft['id'] = uuid()
            draft['timestamp'] = Date.now()
          })
        )
      })
    ),
  editIncome: (groupId, incomeId, newIncome) =>
    set(
      produce<PersistedState>(store => {
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
      })
    ),
  deleteIncome: (groupId, incomeId) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        const incomeIndex = findItemIndex(incomeId, store.groups[groupIndex].incomes)
        if (incomeIndex === -1) return
        store.groups[groupIndex].incomes.splice(incomeIndex, 1)
      })
    ),
  deleteGroupIncomes: groupId =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        store.groups[groupIndex].incomes = []
      })
    ),
})
