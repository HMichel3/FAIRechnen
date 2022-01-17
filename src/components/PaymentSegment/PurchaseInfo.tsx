import { Member, Purchase } from '../../App/types'
import { format } from 'date-fns'
import { displayCurrencyValue } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useCallback } from 'react'
import { useStore } from '../../stores/useStore'
import { all, includes, join, map, prepend, prop } from 'ramda'

export interface PurchaseInfoProps {
  purchase: Purchase
}

export const PurchaseInfo = ({ purchase }: PurchaseInfoProps): JSX.Element => {
  const purchaser = usePersistedStore(useCallback(s => s.getMemberById(purchase.purchaserId), [purchase]))
  const beneficiaries = usePersistedStore(useCallback(s => s.getMembersByIds(purchase.beneficiaryIds), [purchase]))
  const { groupMembers } = useStore.useSelectedGroup()

  const involvedMembers = purchase.isPurchaserOnlyPaying ? beneficiaries : prepend(purchaser, beneficiaries)
  const involvedMemberNames = map(prop('name'), involvedMembers)
  const involvedMemberNamesSeparated = join(', ', involvedMemberNames)
  const isPurchaseForAllGroupMembers = (involvedMembers: Member[], groupMembers: Member[]) =>
    all(groupMember => includes(groupMember, involvedMembers), groupMembers)
  const memberNamesList = isPurchaseForAllGroupMembers(involvedMembers, groupMembers)
    ? 'Alle'
    : involvedMemberNamesSeparated

  const displayedAdditions = purchase.additions.length === 1 ? '1 Zusatz' : `${purchase.additions.length} Zusätze`

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>{purchase.name}</div>
        <div>{displayCurrencyValue(purchase.amount)}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Von {purchaser?.name}</div>
        <div>{format(purchase.timestamp, 'dd.MM.y, HH:mm')}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Für {memberNamesList}</div>
        <div>{displayedAdditions}</div>
      </div>
    </>
  )
}
