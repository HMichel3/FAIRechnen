import { useCallback } from 'react'
import { Group, SelectedGroup } from '../App/types'
import { usePersistedStore } from '../stores/usePersistedStore'
import {
  calculateCompensationAmount,
  calculateIncomeAmounts,
  calculateCompleteMembers,
  calculatePurchaseAmounts,
  mergeAndSortPayments,
  calculateGroupTotalAmount,
} from './utils'

// needed hook, instead of in store, because otherwise the group does not get updated correctly
export const useSelectedGroup = (groupId: Group['groupId']): SelectedGroup => {
  const group = usePersistedStore(useCallback(s => s.getGroup(groupId), [groupId]))
  const groupMembers = usePersistedStore(useCallback(s => s.getGroupMembers(groupId), [groupId]))
  const groupPurchases = usePersistedStore(useCallback(s => s.getGroupPurchases(groupId), [groupId]))
  const groupIncomes = usePersistedStore(useCallback(s => s.getGroupIncomes(groupId), [groupId]))
  const groupCompensations = usePersistedStore(useCallback(s => s.getGroupCompensations(groupId), [groupId]))
  const groupTotalAmount = calculateGroupTotalAmount(groupPurchases, groupIncomes)
  const purchasesAmounts = calculatePurchaseAmounts(groupPurchases)
  const incomesAmounts = calculateIncomeAmounts(groupIncomes)
  const compensationsAmount = calculateCompensationAmount(groupCompensations)
  const completeGroupMembers = calculateCompleteMembers(
    groupMembers,
    purchasesAmounts,
    incomesAmounts,
    compensationsAmount
  )
  const groupPayments = mergeAndSortPayments(groupPurchases, groupIncomes, groupCompensations)

  return {
    group: { ...group, totalAmount: groupTotalAmount },
    groupMembers: completeGroupMembers,
    groupPayments,
  }
}
