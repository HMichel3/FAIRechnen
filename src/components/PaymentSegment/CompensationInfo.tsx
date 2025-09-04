import { IonCol, IonGrid, IonIcon, IonLabel, IonRow } from '@ionic/react'
import { arrowForwardSharp } from 'ionicons/icons'
import { CompensationsWithoutTimestamp } from '../../App/types'
import { displayCurrencyValue, getCompensationInfo } from '../../App/utils'
import { useStore } from '../../stores/useStore'

type CompensationInfoProps = {
  compensation: CompensationsWithoutTimestamp
}

export const CompensationInfo = ({ compensation }: CompensationInfoProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { payer, receiver } = getCompensationInfo(compensation, members)

  return (
    <IonGrid className='p-0 w-full'>
      <IonRow>
        <IonCol className='flex items-center p-0' size='4.5'>
          <IonLabel>{payer.name}</IonLabel>
        </IonCol>
        <IonCol className='flex flex-col items-center p-0 px-1' size='3'>
          <IonLabel>{displayCurrencyValue(compensation.amount)}</IonLabel>
          <IonIcon icon={arrowForwardSharp} />
        </IonCol>
        <IonCol className='flex items-center justify-end p-0' size='4.5'>
          <IonLabel>{receiver.name}</IonLabel>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}
