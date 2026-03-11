import { IonText } from '@ionic/react'
import { useGroupData } from '../../hooks/useGroupData'
import {
  displayCurrencyValue,
  displayMemberQuantity,
  displayPaymentQuantity,
  displayTimestamp,
} from '../../utils/display'

type GroupInfoProps = {
  groupId: string
}

export const GroupInfo = ({ groupId }: GroupInfoProps) => {
  const groupData = useGroupData(groupId)

  return (
    <>
      <div className='mb-1 flex justify-between gap-4'>
        <IonText className='truncate'>{groupData.name}</IonText>
        <IonText className='whitespace-nowrap'>{displayCurrencyValue(groupData.totalAmount)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <div className='flex gap-2 whitespace-nowrap text-sm text-neutral-400'>
          <IonText className='truncate'>{displayMemberQuantity(groupData.members.length)}</IonText>
          <IonText>•</IonText>
          <IonText className='truncate'>{displayPaymentQuantity(groupData.paymentQuantity)}</IonText>
        </div>
        <IonText className='whitespace-nowrap'>{displayTimestamp(groupData.timestamp, { noTime: true })}</IonText>
      </div>
    </>
  )
}
