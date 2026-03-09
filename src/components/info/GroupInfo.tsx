import { IonText } from '@ionic/react'
import { Group } from '../../types/store'
import { calculateGroupTotalAmount } from '../../utils/calculation'
import {
  displayCurrencyValue,
  displayHistoryQuantity,
  displayMemberQuantity,
  displayTimestamp,
} from '../../utils/display'

type GroupInfoProps = {
  group: Group
}

export const GroupInfo = ({ group }: GroupInfoProps) => {
  const historyQuantity = group.purchases.length + group.incomes.length + group.compensations.length
  const groupTotalAmount = calculateGroupTotalAmount(group)

  return (
    <>
      <div className='mb-1 flex justify-between gap-4'>
        <IonText className='truncate'>{group.name}</IonText>
        <IonText className='whitespace-nowrap'>{displayCurrencyValue(groupTotalAmount)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <div className='flex gap-2 whitespace-nowrap text-sm text-neutral-400'>
          <IonText className='truncate'>{displayMemberQuantity(group.members.length)}</IonText>
          <IonText>•</IonText>
          <IonText className='truncate'>{displayHistoryQuantity(historyQuantity)}</IonText>
        </div>
        <IonText className='whitespace-nowrap'>{displayTimestamp(group.timestamp, { noTime: true })}</IonText>
      </div>
    </>
  )
}
