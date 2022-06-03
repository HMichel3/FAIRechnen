import { calculateGroupTotalAmount, displayCurrencyValue } from '../../App/utils'
import { SmallLabelComponent } from '../../components/SlidingListItem/SmallLabelComponent'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { displayMemberQuantity, displayHistoryQuantity } from './utils'

interface GroupInfoProps {
  groupId: string
}

export const GroupInfo = ({ groupId }: GroupInfoProps): JSX.Element | null => {
  const group = usePersistedStore(s => s.getGroup(groupId))

  if (!group) return null

  const historyQuantity = group.purchases.length + group.incomes.length + group.compensations.length
  const groupTotalAmount = calculateGroupTotalAmount(group.purchases, group.incomes)

  return (
    <>
      <SmallLabelComponent>
        {displayMemberQuantity(group.members.length)}, {displayHistoryQuantity(historyQuantity)}
      </SmallLabelComponent>
      <SmallLabelComponent>{displayCurrencyValue(groupTotalAmount)}</SmallLabelComponent>
    </>
  )
}
