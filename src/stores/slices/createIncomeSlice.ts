import { GetState, SetState } from 'zustand'
import { Group, Income } from '../../App/types'
import { getArrayItemById, getArrayItemsByGroupId, removeArrayItemsById, updateArrayItemById } from '../../App/utils'
import { incomeDTO, IncomeWithoutIdAndTimeStamp } from '../../dtos/incomeDTO'
import { PersistedState } from '../usePersistedStore'
import { addEarnerToBeneficiariesIfNeeded, checkIfAllIdsExistInMembers } from '../utils'

export interface IncomeSlice {
  incomes: Income[]
  addIncome: (almostIncome: IncomeWithoutIdAndTimeStamp) => void
  editIncome: (incomeId: Income['id'], oldIncome: Income, newIncome: Income) => void
  deleteIncome: (incomeId: Income['id']) => void
  deleteGroupIncomes: (groupId: Group['id']) => void
  getGroupIncomes: (groupId: Group['id']) => Income[]
}

export const createIncomeSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): IncomeSlice => ({
  incomes: [],
  addIncome: almostIncome => {
    const allIncomeBeneficiaries = addEarnerToBeneficiariesIfNeeded(almostIncome)
    const newIncomeAmount = get().adjustPurchaseAmountOnMembers(
      -almostIncome.amount,
      almostIncome.earnerId,
      allIncomeBeneficiaries
    )
    set({ incomes: [...get().incomes, incomeDTO({ ...almostIncome, amount: newIncomeAmount })] })
  },
  editIncome: (incomeId, oldIncome, newIncome) => {
    // revert oldIncome
    if (checkIfAllIdsExistInMembers([oldIncome.earnerId, ...oldIncome.beneficiaryIds], get().members)) {
      const allOldIncomeBeneficiaries = addEarnerToBeneficiariesIfNeeded(oldIncome)
      get().adjustPurchaseAmountOnMembers(oldIncome.amount, oldIncome.earnerId, allOldIncomeBeneficiaries)
    }
    // update oldIncome
    const allNewIncomeBeneficiaries = addEarnerToBeneficiariesIfNeeded(newIncome)
    const newIncomeAmount = get().adjustPurchaseAmountOnMembers(
      -newIncome.amount,
      newIncome.earnerId,
      allNewIncomeBeneficiaries
    )
    set({ incomes: updateArrayItemById(incomeId, { ...newIncome, amount: newIncomeAmount }, get().incomes) })
    get().deleteDeletedMembersAfterCheck([...oldIncome.beneficiaryIds, oldIncome.earnerId])
  },
  deleteIncome: incomeId => {
    const { amount, earnerId, beneficiaryIds, isEarnerOnlyEarning } = getArrayItemById(incomeId, get().incomes)
    if (checkIfAllIdsExistInMembers([earnerId, ...beneficiaryIds], get().members)) {
      const allIncomeBeneficiaries = addEarnerToBeneficiariesIfNeeded({
        earnerId,
        beneficiaryIds,
        isEarnerOnlyEarning,
      })
      // positive amount, because it gets deleted
      get().adjustPurchaseAmountOnMembers(amount, earnerId, allIncomeBeneficiaries)
    }
    set({ incomes: removeArrayItemsById(incomeId, get().incomes) })
    get().deleteDeletedMembersAfterCheck([...beneficiaryIds, earnerId])
  },
  deleteGroupIncomes: groupId => {
    set({ incomes: removeArrayItemsById(groupId, get().incomes, 'groupId') })
  },
  getGroupIncomes: groupId => {
    return getArrayItemsByGroupId(groupId, get().incomes)
  },
})
