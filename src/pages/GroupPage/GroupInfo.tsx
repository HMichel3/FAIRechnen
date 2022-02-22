import { useCallback } from 'react'
import { CompleteGroup } from '../../App/types'
import { displayCurrencyValue } from '../../App/utils'
import { SmallLabelComponent } from '../../components/SlidingListItem/SmallLabelComponent'
import { useDeepCompareMemo } from '../../hooks/useDeepCompareMemo'
import { calculateGroupTotalAmount } from '../../hooks/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { displayMemberQuantity, displayHistoryQuantity } from './utils'

interface GroupInfoProps {
  groupId: CompleteGroup['groupId']
}

export const GroupInfo = ({ groupId }: GroupInfoProps) => {
  const groupMembers = usePersistedStore(useCallback(s => s.getGroupMembers(groupId), [groupId]))
  const groupPurchases = usePersistedStore(useCallback(s => s.getGroupPurchases(groupId), [groupId]))
  const groupIncomes = usePersistedStore(useCallback(s => s.getGroupIncomes(groupId), [groupId]))
  const groupCompensations = usePersistedStore(useCallback(s => s.getGroupCompensations(groupId), [groupId]))
  const historyQuantity = useDeepCompareMemo(
    () => groupPurchases.length + groupIncomes.length + groupCompensations.length,
    [groupPurchases, groupIncomes, groupCompensations]
  )
  const groupTotalAmount = useDeepCompareMemo(
    () => calculateGroupTotalAmount(groupPurchases, groupIncomes),
    [groupPurchases, groupIncomes]
  )

  return (
    <>
      <SmallLabelComponent>
        {displayMemberQuantity(groupMembers.length)}, {displayHistoryQuantity(historyQuantity)}
      </SmallLabelComponent>
      <SmallLabelComponent>{displayCurrencyValue(groupTotalAmount)}</SmallLabelComponent>
    </>
  )
}
