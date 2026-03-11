import { useMemo } from 'react'
import { useParams } from 'react-router'
import { usePersistedStore } from '../stores/usePersistedStore'
import { calculateGroupTotalAmount, calculateMembersWithAmounts } from '../utils/calculation'
import { generateCompensationChain } from '../utils/compensation'
import { mergeAndSortPayments } from '../utils/payment'

export const useGroupData = (groupId?: string) => {
  const { id } = useParams<{ id: string }>()
  const group = usePersistedStore(s => s.getGroup(groupId ?? id))

  if (!group) {
    throw new Error('GROUP_NOT_FOUND')
  }

  const membersWithAmounts = useMemo(
    () => calculateMembersWithAmounts(group.members, group.purchases, group.incomes, group.compensations),
    [group.members, group.purchases, group.incomes, group.compensations]
  )

  const sortedPayments = useMemo(
    () => mergeAndSortPayments(group.purchases, group.incomes, group.compensations),
    [group.purchases, group.incomes, group.compensations]
  )

  const compensationChain = useMemo(() => generateCompensationChain(membersWithAmounts), [membersWithAmounts])

  const totalAmount = useMemo(
    () => calculateGroupTotalAmount(group.purchases, group.incomes),
    [group.purchases, group.incomes]
  )

  return {
    ...group,
    membersWithAmounts,
    sortedPayments,
    compensationChain,
    totalAmount,
    paymentQuantity: sortedPayments.length,
    originalGroup: group, // needed for backup in GroupInfoPage
  }
}

export type GroupData = ReturnType<typeof useGroupData>
