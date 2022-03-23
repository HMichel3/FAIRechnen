import { format } from 'date-fns'
import { displayCurrencyValue, findItem, findItems } from '../../App/utils'
import { displayAdditionQuantity, displayBeneficiaryNames, getAdditionPayerIdsNotInBeneficiaries } from './utils'
import { IonLabel } from '@ionic/react'
import { Purchase } from '../../stores/types'
import { useStore } from '../../stores/useStore'

export interface PurchaseInfoProps {
  purchase: Purchase
}

export const PurchaseInfo = ({ purchase }: PurchaseInfoProps): JSX.Element => {
  const { members } = useStore.useSelectedGroup()
  const { name, amount, purchaserId, beneficiaryIds, additions, timestamp } = purchase
  const additionPayerIds = getAdditionPayerIdsNotInBeneficiaries(additions, beneficiaryIds)
  const purchaser = findItem(purchaserId, members)
  const beneficiaries = findItems(beneficiaryIds, members)
  const additionPayers = findItems(additionPayerIds, members)

  return (
    <>
      <div style={{ display: 'flex' }}>
        <IonLabel style={{ flex: 1, paddingRight: 16 }}>{name}</IonLabel>
        <div>{displayCurrencyValue(amount)}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <IonLabel style={{ flex: 1, paddingRight: 16 }}>Von {purchaser.name}</IonLabel>
        <div>{format(timestamp, 'dd.MM.y, HH:mm')}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <IonLabel style={{ flex: 1, paddingRight: 16 }}>
          Für {displayBeneficiaryNames(beneficiaries, members, additionPayers)}
        </IonLabel>
        <div>{displayAdditionQuantity(additions.length)}</div>
      </div>
    </>
  )
}
