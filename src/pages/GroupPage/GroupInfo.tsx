import { IonText } from '@ionic/react'
import { calculateGroupTotalAmount, displayCurrencyValue } from '../../App/utils'
import { displayMemberQuantity, displayHistoryQuantity } from './utils'
import { Group } from '../../stores/types'

interface GroupInfoProps {
  group: Group
}

export const GroupInfo = ({ group }: GroupInfoProps): JSX.Element | null => {
  const historyQuantity = group.purchases.length + group.incomes.length + group.compensations.length
  const groupTotalAmount = calculateGroupTotalAmount(group.purchases, group.incomes)

  return (
    <div className='flex flex-col'>
      <IonText className='text-sm text-neutral-400'>
        {displayMemberQuantity(group.members.length)}, {displayHistoryQuantity(historyQuantity)}
      </IonText>
      <IonText className='text-sm text-neutral-400'>{displayCurrencyValue(groupTotalAmount)}</IonText>
    </div>
  )
}
