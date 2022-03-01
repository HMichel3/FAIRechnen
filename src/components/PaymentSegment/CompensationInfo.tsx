import { IonCol, IonGrid, IonIcon, IonLabel, IonRow } from '@ionic/react'
import { displayCurrencyValue, findItemById } from '../../App/utils'
import { arrowForwardSharp } from 'ionicons/icons'
import { useStore } from '../../stores/useStore'
import { AlmostCompensation } from '../AddCompensationModal/useAddCompensationModal'

interface CompensationInfoProps {
  compensation: Omit<AlmostCompensation, 'payerReceiverId'>
}

export const CompensationInfo = ({ compensation }: CompensationInfoProps): JSX.Element => {
  const { groupMembers } = useStore.useSelectedGroup()
  const { amount, payerId, receiverId } = compensation
  const payer = findItemById(payerId, groupMembers, 'memberId')
  const receiver = findItemById(receiverId, groupMembers, 'memberId')

  return (
    <IonGrid className='ion-no-padding'>
      <IonRow className='ion-align-items-center' style={{ flexWrap: 'nowrap' }}>
        <IonCol style={{ paddingRight: 4 }} size='4.5'>
          <IonLabel>{payer.name}</IonLabel>
        </IonCol>
        <IonCol className='ion-text-center' style={{ paddingLeft: 4, paddingRight: 4 }} size='3'>
          <IonLabel>{displayCurrencyValue(amount)}</IonLabel>
          <IonIcon icon={arrowForwardSharp} />
        </IonCol>
        <IonCol className='ion-text-end' style={{ paddingLeft: 4 }} size='4.5'>
          <IonLabel>{receiver.name}</IonLabel>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}
