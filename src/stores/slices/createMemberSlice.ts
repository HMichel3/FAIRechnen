import { findItemIndex } from '../../App/utils'
import { Member } from '../types'
import { PersistImmer } from '../usePersistedStore'

export type MemberSlice = {
  addMember: (groupId: string, memberName: Member['name']) => void
  editMemberName: (groupId: string, memberId: string, name: Member['name']) => void
  deleteMember: (groupId: string, memberId: string) => void
}

export const createMemberSlice: PersistImmer<MemberSlice> = set => ({
  addMember: (groupId, memberName) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groups[groupIndex].members.push({ id: crypto.randomUUID(), name: memberName, timestamp: Date.now() })
    }),
  editMemberName: (groupId, memberId, name) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const memberIndex = findItemIndex(memberId, store.groups[groupIndex].members)
      if (memberIndex === -1) return
      store.groups[groupIndex].members[memberIndex].name = name
    }),
  deleteMember: (groupId, memberId) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const memberIndex = findItemIndex(memberId, store.groups[groupIndex].members)
      if (memberIndex === -1) return
      store.groups[groupIndex].members.splice(memberIndex, 1)
    }),
})
