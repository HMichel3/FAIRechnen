import { IonCol, IonGrid, IonIcon, IonLabel, IonRow } from '@ionic/react'
import { displayCurrencyValue, findItem } from '../../App/utils'
import { arrowForwardSharp } from 'ionicons/icons'
import { useStore } from '../../stores/useStore'
import { CompensationsWithoutTimestamp } from '../../App/types'

interface CompensationInfoProps {
  compensation: CompensationsWithoutTimestamp
}

export const CompensationInfo = ({ compensation }: CompensationInfoProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { amount, payerId, receiverId } = compensation
  const payer = findItem(payerId, members)
  const receiver = findItem(receiverId, members)

  return (
    <IonGrid className='p-0'>
      <IonRow>
        <IonCol className='flex items-center p-0' size='4.5'>
          <IonLabel>{payer.name}</IonLabel>
        </IonCol>
        <IonCol className='flex flex-col items-center p-0 px-1' size='3'>
          <IonLabel>{displayCurrencyValue(amount)}</IonLabel>
          <IonIcon icon={arrowForwardSharp} />
        </IonCol>
        <IonCol className='flex items-center justify-end p-0' size='4.5'>
          <IonLabel>{receiver.name}</IonLabel>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}
