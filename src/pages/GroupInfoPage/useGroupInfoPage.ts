import { isEmpty, join, map } from 'ramda'
import { useEffect } from 'react'
import { Group, Member } from '../../App/types'
import { useDeepCompareEffect } from '../../hooks/useDeepCompareEffect'
import { useSelectedGroup } from '../../hooks/useSelectedGroup'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { Share } from '@capacitor/share'
import { calculateMemberTotalAmount, displayCurrencyValue, generateOnePossibleCompensationChain } from '../../App/utils'

export const useGroupInfoPage = (groupId: Group['id']) => {
  const editGroupName = usePersistedStore.useEditGroupName()
  const addMember = usePersistedStore.useAddMember()
  const getMemberById = usePersistedStore.useGetMemberById()
  const setSelectedGroup = useStore.useSetSelectedGroup()
  const clearSelectedGroup = useStore.useClearSelectedGroup()
  const selectedGroup = useSelectedGroup(groupId)

  useDeepCompareEffect(() => {
    // Saves the selectedGroup, to make it accessible in all child react components
    setSelectedGroup(selectedGroup)
  }, [selectedGroup])

  // onUnmount
  useEffect(() => () => clearSelectedGroup(), [clearSelectedGroup])

  const onEditGroupName = (newGroupName: Group['name']) => {
    editGroupName(groupId, newGroupName)
  }

  const onAddNewMember = (newMemberName: Member['name']) => {
    addMember(groupId, newMemberName)
  }

  const displayMemberTotalAmount = (memberId: Member['id']) =>
    displayCurrencyValue(
      calculateMemberTotalAmount(
        memberId,
        selectedGroup.groupPurchases,
        selectedGroup.groupIncomes,
        selectedGroup.groupCompensations
      )
    )

  const onShareBill = () => {
    const groupOverview = map(
      groupMember =>
        `${groupMember.name} | ${displayMemberTotalAmount(groupMember.id)} | ${displayCurrencyValue(
          groupMember.amount
        )}`,
      selectedGroup.groupMembers
    )
    const groupOverviewExplanation = [
      `*Gruppe: ${selectedGroup.group.name}*`,
      '_Name_ | _Ausgaben_ | _Ausstehend_',
      '----------------------------------------',
    ]
    const completeGroupOverview = [...groupOverviewExplanation, ...groupOverview, '']

    const compensationProposal = map(
      compensation =>
        `${getMemberById(compensation.payerId).name} --> ${displayCurrencyValue(compensation.amount)} --> ${
          getMemberById(compensation.receiverId).name
        }`,
      generateOnePossibleCompensationChain(selectedGroup.group.id, selectedGroup.groupMembers)
    )
    const compensationProposalExplanation = [
      '*Zahlungsvorschlag*',
      '_Zahler_ --> _Betrag_ --> _Empfänger_',
      '----------------------------------------',
    ]
    const completeCompensationProposal = [...compensationProposalExplanation, ...compensationProposal]

    const displayBill = join('\n', [
      ...completeGroupOverview,
      ...(!isEmpty(compensationProposal) ? completeCompensationProposal : []),
    ])

    Share.share({
      title: 'split-it Rechnung',
      text: displayBill,
      dialogTitle: 'split-it Rechnung teilen',
    })
  }

  return { selectedGroup, onEditGroupName, onAddNewMember, onShareBill }
}
