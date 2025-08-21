import { IonItem, IonRadio } from '@ionic/react'
import { CompensationsWithoutTimestamp } from '../../../App/types'
import { CompensationInfo } from '../../PaymentSegment/CompensationInfo'

type CompensationItemProps = {
  compensation: CompensationsWithoutTimestamp
}

export const CompensationItem = ({ compensation }: CompensationItemProps): JSX.Element => (
  <IonItem className='item-border-color'>
    <IonRadio value={compensation.id} labelPlacement='end' legacy-radio>
      <CompensationInfo compensation={compensation} />
    </IonRadio>
  </IonItem>
)
