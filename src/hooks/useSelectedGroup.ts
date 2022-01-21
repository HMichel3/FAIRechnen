import { useCallback, useMemo } from 'react'
import { Group, SelectedGroup } from '../App/types'
import { mergeAndSortArraysByTimestamp } from '../App/utils'
import { usePersistedStore } from '../stores/usePersistedStore'

export const useSelectedGroup = (groupId: Group['id']): SelectedGroup => {
  const group = usePersistedStore(useCallback(s => s.getGroup(groupId), [groupId]))
  const groupMembers = usePersistedStore(useCallback(s => s.getGroupMembers(groupId), [groupId]))
  const groupPurchases = usePersistedStore(useCallback(s => s.getGroupPurchases(groupId), [groupId]))
  const groupIncomes = usePersistedStore(useCallback(s => s.getGroupIncomes(groupId), [groupId]))
  const groupCompensations = usePersistedStore(useCallback(s => s.getGroupCompensations(groupId), [groupId]))
  const groupPayments = useMemo(
    () => mergeAndSortArraysByTimestamp(groupPurchases, groupIncomes, groupCompensations),
    [groupPurchases, groupIncomes, groupCompensations]
  )

  return { group, groupMembers, groupPurchases, groupIncomes, groupCompensations, groupPayments }
}
