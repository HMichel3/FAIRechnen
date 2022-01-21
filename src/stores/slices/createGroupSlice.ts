import { GetState, SetState } from 'zustand'
import { groupDTO } from '../../dtos/groupDTO'
import { Group } from '../../App/types'
import { getArrayItemById, removeArrayItemsById, updateArrayItemById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'

export interface GroupSlice {
  groups: Group[]
  addGroup: (groupName: Group['name']) => Group['id']
  editGroupName: (groupId: Group['id'], newGroupName: Group['name']) => void
  deleteGroup: (groupId: Group['id']) => void
  getGroup: (groupId: Group['id']) => Group
  setGroups: (groups: Group[]) => void
}

export const createGroupSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): GroupSlice => ({
  groups: [],
  addGroup: groupName => {
    const group = groupDTO(groupName)
    set({ groups: [group, ...get().groups] })
    return group.id
  },
  editGroupName: (groupId, groupName) => {
    const group = get().getGroup(groupId)
    const newGroup = { ...group, name: groupName }
    set({ groups: updateArrayItemById(groupId, newGroup, get().groups) })
  },
  deleteGroup: groupId => {
    get().deleteGroupMembers(groupId)
    get().deleteGroupPurchases(groupId)
    get().deleteGroupCompensations(groupId)
    set({ groups: removeArrayItemsById(groupId, get().groups) })
  },
  getGroup: groupId => {
    return getArrayItemById(groupId, get().groups)
  },
  setGroups: groups => {
    set({ groups })
  },
})
