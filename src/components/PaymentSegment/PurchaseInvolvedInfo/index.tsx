import { Purchase } from '../../../App/types'
import { IonLabel } from '@ionic/react'
import { usePurchaseInvolvedInfo } from './usePurchaseInvolvedInfo'
import { format } from 'date-fns'

export interface PurchaseInvolvedInfoProps {
  purchase: Purchase
}

export const PurchaseInvolvedInfo = ({ purchase }: PurchaseInvolvedInfoProps): JSX.Element => {
  const { purchaser, memberNamesList } = usePurchaseInvolvedInfo(purchase)

  return (
    <div className='small-label-component'>
      <IonLabel style={{ marginBottom: 1 }}>Von {purchaser?.name}</IonLabel>
      <IonLabel>Für {memberNamesList}</IonLabel>
      <div style={{ marginTop: 3 }}>{format(purchase.timestamp, 'dd.MM.y, HH:mm')}</div>
    </div>
  )
}
