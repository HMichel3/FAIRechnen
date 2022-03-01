import { useEffect } from 'react'
import { CompleteGroup } from '../../App/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { Share } from '@capacitor/share'
import { groupDTO } from '../../dtos/groupDTO'
import { memberDTO } from '../../dtos/memberDTO'
import { useSelectedGroup } from '../../hooks/useSelectedGroup'
import { generateBill } from './utils'

export const useGroupInfoPage = (groupId: CompleteGroup['groupId']) => {
  const getGroup = usePersistedStore.useGetGroup()
  const editGroup = usePersistedStore.useEditGroup()
  const addMember = usePersistedStore.useAddMember()
  const setSelectedGroup = useStore.useSetSelectedGroup()
  const clearSelectedGroup = useStore.useClearSelectedGroup()
  const selectedGroup = useSelectedGroup(groupId)
  const { group, groupMembers, groupPayments } = selectedGroup

  useEffect(() => {
    // Saves the selectedGroup, to make it accessible in all child react components
    setSelectedGroup(selectedGroup)
  }, [selectedGroup, setSelectedGroup])

  // onUnmount
  useEffect(() => () => clearSelectedGroup(), [clearSelectedGroup])

  const onEditGroupName = (newGroupName: CompleteGroup['name']) => {
    const group = getGroup(groupId)
    const editedGroup = groupDTO({ ...group, name: newGroupName })
    editGroup(editedGroup)
  }

  const onAddNewMember = (newMemberName: string) => {
    const newMember = memberDTO({ groupId, name: newMemberName })
    addMember(newMember)
  }

  const onShareBill = () => {
    Share.share({
      title: 'split-it Rechnung',
      text: generateBill(group, groupMembers),
      dialogTitle: 'split-it Rechnung teilen',
    })
  }

  return { group, groupMembers, groupPayments, onEditGroupName, onAddNewMember, onShareBill }
}
