import { prepend, all, includes, map, prop, join } from 'ramda'
import { useCallback } from 'react'
import { PurchaseInvolvedInfoProps } from '.'
import { Member } from '../../../App/types'
import { usePersistedStore } from '../../../stores/usePersistedStore'
import { useStore } from '../../../stores/useStore'

export const usePurchaseInvolvedInfo = (purchase: PurchaseInvolvedInfoProps['purchase']) => {
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

  return { purchaser, memberNamesList }
}
