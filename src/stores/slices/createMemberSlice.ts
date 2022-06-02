import produce from 'immer'
import { SetState } from 'zustand'
import { Member } from '../types'
import { PersistedState } from '../usePersistedStore'
import { v4 as uuid } from 'uuid'
import { findItemIndex } from '../../App/utils'

export interface MemberSlice {
  addMember: (groupId: string, memberName: Member['name']) => void
  editMemberName: (groupId: string, memberId: string, name: Member['name']) => void
  deleteMember: (groupId: string, memberId: string) => void
}

export const createMemberSlice = (set: SetState<PersistedState>): MemberSlice => ({
  addMember: (groupId, memberName) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        store.groups[groupIndex].members.push({ id: uuid(), name: memberName, timestamp: Date.now() })
      })
    ),
  editMemberName: (groupId, memberId, name) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        const memberIndex = findItemIndex(memberId, store.groups[groupIndex].members)
        if (memberIndex === -1) return
        store.groups[groupIndex].members[memberIndex].name = name
      })
    ),
  deleteMember: (groupId, memberId) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        const memberIndex = findItemIndex(memberId, store.groups[groupIndex].members)
        if (memberIndex === -1) return
        store.groups[groupIndex].members.splice(memberIndex, 1)
      })
    ),
})
