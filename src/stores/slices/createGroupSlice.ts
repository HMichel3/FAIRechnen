import { GetState, SetState } from 'zustand'
import { Group } from '../../App/types'
import { findItemById, removeItemById, updateArrayItemById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'

export interface GroupSlice {
  groups: Group[]
  addGroup: (group: Group) => void
  editGroup: (newGroup: Group) => void
  deleteGroup: (groupId: Group['groupId']) => void
  getGroup: (groupId: Group['groupId']) => Group
  setGroups: (groups: Group[]) => void // needed for reordering
}

export const createGroupSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): GroupSlice => ({
  groups: [],
  addGroup: group => set(s => ({ groups: [group, ...s.groups] })),
  editGroup: newGroup => set(s => ({ groups: updateArrayItemById(newGroup.groupId, newGroup, s.groups, 'groupId') })),
  deleteGroup: groupId => {
    get().deleteGroupMembers(groupId)
    get().deleteGroupPurchases(groupId)
    get().deleteGroupIncomes(groupId)
    get().deleteGroupCompensations(groupId)
    set(s => ({ groups: removeItemById(groupId, s.groups, 'groupId') }))
  },
  getGroup: groupId => findItemById(groupId, get().groups, 'groupId'),
  setGroups: groups => set({ groups }),
})
