import { useCallback } from 'react'
import { CompleteGroup } from '../../App/types'
import { displayCurrencyValue } from '../../App/utils'
import { SmallLabelComponent } from '../../components/SlidingListItem/SmallLabelComponent'
import { useDeepCompareMemo } from '../../hooks/useDeepCompareMemo'
import { calculateGroupTotalAmount } from '../../hooks/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'

interface GroupTotalComponentProps {
  groupId: CompleteGroup['groupId']
}

export const GroupTotalComponent = ({ groupId }: GroupTotalComponentProps) => {
  const groupPurchases = usePersistedStore(useCallback(s => s.getGroupPurchases(groupId), [groupId]))
  const groupIncomes = usePersistedStore(useCallback(s => s.getGroupIncomes(groupId), [groupId]))
  const groupTotalAmount = useDeepCompareMemo(
    () => calculateGroupTotalAmount(groupPurchases, groupIncomes),
    [groupPurchases, groupIncomes]
  )

  return <SmallLabelComponent>{displayCurrencyValue(groupTotalAmount)}</SmallLabelComponent>
}
