import { Purchase } from '../../App/types'
import { format } from 'date-fns'
import { displayCurrencyValue, findItemById, findItemsByIds } from '../../App/utils'
import { useStore } from '../../stores/useStore'
import { displayBeneficiaryNames } from './utils'

export interface PurchaseInfoProps {
  purchase: Purchase
}

export const PurchaseInfo = ({ purchase }: PurchaseInfoProps): JSX.Element => {
  const { groupMembers } = useStore.useSelectedGroup()
  const { name, amount, purchaserId, beneficiaryIds, additions, timestamp } = purchase
  const purchaser = findItemById(purchaserId, groupMembers, 'memberId')
  const beneficiaries = findItemsByIds(beneficiaryIds, groupMembers, 'memberId')

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>{name}</div>
        <div>{displayCurrencyValue(amount)}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Von {purchaser?.name}</div>
        <div>{format(timestamp, 'dd.MM.y, HH:mm')}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Für {displayBeneficiaryNames(beneficiaries, groupMembers)}</div>
        <div>{additions.length === 1 ? '1 Zusatz' : `${additions.length} Zusätze`}</div>
      </div>
    </>
  )
}
