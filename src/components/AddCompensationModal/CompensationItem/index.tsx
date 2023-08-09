import { IonItem, IonLabel, IonRadio } from '@ionic/react'
import { CompensationInfo } from '../../PaymentSegment/CompensationInfo'
import { CompensationsWithoutTimestamp } from '../../../App/types'

interface CompensationItemProps {
  compensation: CompensationsWithoutTimestamp
}

export const CompensationItem = ({ compensation }: CompensationItemProps): JSX.Element => (
  <IonItem className='item-border-color'>
    <IonRadio value={compensation.id} legacy />
    <IonLabel className='ml-4'>
      <CompensationInfo compensation={compensation} />
    </IonLabel>
  </IonItem>
)
