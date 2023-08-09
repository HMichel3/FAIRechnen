import { format } from 'date-fns'
import { displayCurrencyValue, findItem, findItems } from '../../App/utils'
import { displayAdditionQuantity, displayBeneficiaryNames, getAdditionPayerIdsNotInBeneficiaries } from './utils'
import { IonLabel, IonText } from '@ionic/react'
import { useStore } from '../../stores/useStore'
import { Purchase } from '../../stores/types'

interface PurchaseInfoProps {
  purchase: Purchase
}

export const PurchaseInfo = ({ purchase }: PurchaseInfoProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { name, amount, purchaserId, beneficiaryIds, additions, timestamp } = purchase
  const additionPayerIds = getAdditionPayerIdsNotInBeneficiaries(additions, beneficiaryIds)
  const purchaser = findItem(purchaserId, members)
  const beneficiaries = findItems(beneficiaryIds, members)
  const additionPayers = findItems(additionPayerIds, members)

  return (
    <>
      <div className='mb-1 flex justify-between gap-4'>
        <IonLabel>{name}</IonLabel>
        <IonText>{displayCurrencyValue(amount)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <IonLabel>Von {purchaser.name}</IonLabel>
        <IonText>{format(timestamp, 'dd.MM.y, HH:mm')}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <IonLabel>Für {displayBeneficiaryNames(beneficiaries, members, additionPayers)}</IonLabel>
        <IonText>{displayAdditionQuantity(additions.length)}</IonText>
      </div>
    </>
  )
}
