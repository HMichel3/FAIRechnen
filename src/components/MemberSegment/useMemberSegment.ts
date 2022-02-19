import { useState } from 'react'
import { CompleteMember } from '../../App/types'
import { memberDTO } from '../../dtos/memberDTO'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

export const useMemberSegment = () => {
  const editMember = usePersistedStore.useEditMember()
  const deleteMember = usePersistedStore.useDeleteMember()
  const { groupMembers } = useStore.useSelectedGroup()
  const [selectedMember, setSelectedMember] = useState<CompleteMember>()
  const [showEditMemberAlert, setShowEditMemberAlert] = useState(false)
  const [showCantDeleteMemberAlert, setShowCantDeleteMemberAlert] = useState(false)

  const onSelectMember = (member: CompleteMember) => {
    setSelectedMember(member)
    setShowEditMemberAlert(true)
  }

  const onEditMemberName = (newMemberName: CompleteMember['name']) => {
    const editedMember = memberDTO({ ...selectedMember!, name: newMemberName })
    editMember(editedMember)
  }

  const onDeleteMember = (member: CompleteMember) => {
    if (member.involved) {
      return setShowCantDeleteMemberAlert(true)
    }
    deleteMember(member.memberId)
  }

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
  }
}
