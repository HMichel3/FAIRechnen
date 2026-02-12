import { NewMember } from '../../App/types'
import { findItem, findItemIndex, isNameInArray, rejectById } from '../../App/utils'
import { PersistImmer } from '../usePersistedStore'
import { withMetaData } from '../utils'

export type MemberSliceResult =
  | { success: true }
  | { success: false; reason: 'group_not_found' | 'member_not_found' | 'duplicate_name' }

export type MemberSlice = {
  addMember: (groupId: string, newMember: NewMember) => MemberSliceResult
  editMember: (groupId: string, memberId: string, newMember: NewMember) => MemberSliceResult
  deleteMember: (groupId: string, memberId: string) => void
}

export const createMemberSlice: PersistImmer<MemberSlice> = (set, get) => ({
  addMember: (groupId, newMember) => {
    const { groups, addContact } = get()
    const groupIndex = findItemIndex(groupId, groups)
    if (groupIndex === -1) {
      return { success: false, reason: 'group_not_found' }
    }
    if (isNameInArray(newMember.name, groups[groupIndex].members)) {
      return { success: false, reason: 'duplicate_name' }
    }
    set(store => {
      store.groups[groupIndex].members.push(withMetaData(newMember))
    })
    addContact(newMember)
    return { success: true }
  },
  editMember: (groupId, memberId, newMember) => {
    const { groups } = get()
    const groupIndex = findItemIndex(groupId, groups)
    if (groupIndex === -1) {
      return { success: false, reason: 'group_not_found' }
    }
    const memberIndex = findItemIndex(memberId, groups[groupIndex].members)
    if (memberIndex === -1) {
      return { success: false, reason: 'member_not_found' }
    }
    if (isNameInArray(newMember.name, groups[groupIndex].members, memberId)) {
      return { success: false, reason: 'duplicate_name' }
    }
    set(store => {
      Object.assign(store.groups[groupIndex].members[memberIndex], newMember)
    })
    return { success: true }
  },
  deleteMember: (groupId, memberId) =>
    set(store => {
      const foundGroup = findItem(groupId, store.groups)
      if (!foundGroup) return
      foundGroup.members = rejectById(memberId, foundGroup.members)
    }),
})
