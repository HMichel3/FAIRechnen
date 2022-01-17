import { Compensation } from '../../App/types'
import { IonCol, IonGrid, IonIcon, IonLabel, IonRow } from '@ionic/react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useCallback } from 'react'
import { displayCurrencyValue } from '../../App/utils'
import { arrowForwardSharp } from 'ionicons/icons'

interface CompensationInfoProps {
  compensation: Compensation
}

export const CompensationInfo = ({ compensation }: CompensationInfoProps): JSX.Element => {
  const payer = usePersistedStore(useCallback(s => s.getMemberById(compensation.payerId), [compensation]))
  const receiver = usePersistedStore(useCallback(s => s.getMemberById(compensation.receiverId), [compensation]))

  return (
    <IonGrid className='ion-no-padding'>
      <IonRow className='ion-align-items-center'>
        <IonCol style={{ paddingRight: 5 }}>
          <IonLabel>{payer?.name}</IonLabel>
        </IonCol>
        <IonCol className='ion-text-center' style={{ paddingLeft: 5, paddingRight: 5 }}>
          <div>{displayCurrencyValue(compensation.amount)}</div>
          <IonIcon icon={arrowForwardSharp} />
        </IonCol>
        <IonCol className='ion-text-end' style={{ paddingLeft: 5 }}>
          <IonLabel>{receiver?.name}</IonLabel>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}
