import { Purchase } from '../../App/types'
import { format } from 'date-fns'
import { displayCurrencyValue, findItemById, findItemsByIds } from '../../App/utils'
import { useStore } from '../../stores/useStore'
import { displayAdditionQuantity, displayBeneficiaryNames, getAdditionPayerIdsNotInBeneficiaries } from './utils'
import { IonLabel } from '@ionic/react'

export interface PurchaseInfoProps {
  purchase: Purchase
}

export const PurchaseInfo = ({ purchase }: PurchaseInfoProps): JSX.Element => {
  const { groupMembers } = useStore.useSelectedGroup()
  const { name, amount, purchaserId, beneficiaryIds, additions, timestamp } = purchase
  const additionPayerIds = getAdditionPayerIdsNotInBeneficiaries(additions, beneficiaryIds)
  const purchaser = findItemById(purchaserId, groupMembers, 'memberId')
  const beneficiaries = findItemsByIds(beneficiaryIds, groupMembers, 'memberId')
  const additionPayers = findItemsByIds(additionPayerIds, groupMembers, 'memberId')

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
          Für {displayBeneficiaryNames(beneficiaries, groupMembers, additionPayers)}
        </IonLabel>
        <div>{displayAdditionQuantity(additions.length)}</div>
      </div>
    </>
  )
}
