import { GetState, SetState } from 'zustand'
import { Group, Member } from '../../App/types'
import { findItemsById, removeItemsById, updateArrayItemById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'

export interface MemberSlice {
  members: Member[]
  addMember: (member: Member) => void
  editMember: (newMember: Member) => void
  deleteMember: (memberId: Member['memberId']) => void
  deleteGroupMembers: (groupId: Group['groupId']) => void
  getGroupMembers: (groupId: Group['groupId']) => Member[]
}

export const createMemberSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): MemberSlice => ({
  members: [],
  addMember: member => set(s => ({ members: [...s.members, member] })),
  editMember: newMember =>
    set(s => ({ members: updateArrayItemById(newMember.memberId, newMember, s.members, 'memberId') })),
  deleteMember: memberId => set(s => ({ members: removeItemsById(memberId, s.members, 'memberId') })),
  deleteGroupMembers: groupId => set(s => ({ members: removeItemsById(groupId, s.members, 'groupId') })),
  getGroupMembers: groupId => findItemsById(groupId, get().members, 'groupId'),
})
