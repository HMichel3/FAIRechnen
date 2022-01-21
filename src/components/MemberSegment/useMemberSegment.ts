import { equals } from 'ramda'
import { useState } from 'react'
import { Member } from '../../App/types'
import { calculateMemberTotalAmount, displayCurrencyValue } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

export const useMemberSegment = () => {
  const editMemberName = usePersistedStore.useEditMemberName()
  const deleteMember = usePersistedStore.useDeleteMember()
  const { groupMembers, groupPurchases, groupIncomes, groupCompensations } = useStore.useSelectedGroup()
  const [selectedMember, setSelectedMember] = useState<Member>()
  const [showEditMemberAlert, setShowEditMemberAlert] = useState(false)
  const [showCantDeleteMemberAlert, setShowCantDeleteMemberAlert] = useState(false)

  const onSelectMember = (member: Member) => {
    setSelectedMember(member)
    setShowEditMemberAlert(true)
  }

  const onEditMemberName = (newMemberName: Member['name']) => {
    editMemberName(selectedMember!.id, newMemberName)
  }

  const onDeleteMember = (member: Member) => {
    equals(member.amount, 0) ? deleteMember(member.id) : setShowCantDeleteMemberAlert(true)
  }

  const displayMemberTotalAmount = (memberId: Member['id']) =>
    displayCurrencyValue(calculateMemberTotalAmount(memberId, groupPurchases, groupIncomes, groupCompensations))

  return {
    groupMembers,
    selectedMember,
    showEditMemberAlert,
    setShowEditMemberAlert,
    showCantDeleteMemberAlert,
    setShowCantDeleteMemberAlert,
    onEditMemberName,
    onDeleteMember,
    onSelectMember,
    displayMemberTotalAmount,
  }
}
