import { useCallback } from 'react'
import { Group, SelectedGroup } from '../App/types'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useDeepCompareMemo } from './useDeepCompareMemo'
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
  const groupTotalAmount = useDeepCompareMemo(
    () => calculateGroupTotalAmount(groupPurchases, groupIncomes),
    [groupPurchases, groupIncomes]
  )
  const purchasesAmounts = useDeepCompareMemo(() => calculatePurchaseAmounts(groupPurchases), [groupPurchases])
  const incomesAmounts = useDeepCompareMemo(() => calculateIncomeAmounts(groupIncomes), [groupIncomes])
  const compensationsAmount = useDeepCompareMemo(
    () => calculateCompensationAmount(groupCompensations),
    [groupCompensations]
  )
  const completeGroupMembers = useDeepCompareMemo(
    () => calculateCompleteMembers(groupMembers, purchasesAmounts, incomesAmounts, compensationsAmount),
    [groupMembers, purchasesAmounts, incomesAmounts, compensationsAmount]
  )
  const groupPayments = useDeepCompareMemo(
    () => mergeAndSortPayments(groupPurchases, groupIncomes, groupCompensations),
    [groupPurchases, groupIncomes, groupCompensations]
  )

  return {
    group: { ...group, totalAmount: groupTotalAmount },
    groupMembers: completeGroupMembers,
    groupPayments,
  }
}
