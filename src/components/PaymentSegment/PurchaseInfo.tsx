import { IonLabel, IonText } from '@ionic/react'
import { displayCurrencyValue, displayTimestamp, getPurchaseInfo } from '../../App/utils'
import { Purchase } from '../../stores/types'
import { useStore } from '../../stores/useStore'
import { displayAdditionQuantity, displayBeneficiaryNames } from './utils'

type PurchaseInfoProps = {
  purchase: Purchase
}

export const PurchaseInfo = ({ purchase }: PurchaseInfoProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { purchaser, beneficiaries, additionPayers } = getPurchaseInfo(purchase, members)

  return (
    <>
      <div className='mb-1 flex justify-between gap-4'>
        <IonLabel>{purchase.name}</IonLabel>
        <IonText>{displayCurrencyValue(purchase.amount)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <IonLabel>Von {purchaser.name}</IonLabel>
        <IonText>{displayTimestamp(purchase.timestamp)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <IonLabel>Für {displayBeneficiaryNames(beneficiaries, members, additionPayers)}</IonLabel>
        <IonText>{displayAdditionQuantity(purchase.additions.length)}</IonText>
      </div>
    </>
  )
}
