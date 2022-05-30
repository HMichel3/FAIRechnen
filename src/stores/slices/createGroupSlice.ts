import { GetState, SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'
import produce from 'immer'
import { v4 as uuid } from 'uuid'
import { isEmpty } from 'ramda'
import { Group } from '../types'
import { findItem, findItemIndex } from '../../App/utils'

export interface GroupSlice {
  groups: Group[]
  addGroup: (groupName: Group['name'], memberNames: { name: string }[]) => void
  editGroupName: (groupId: string, groupName: Group['name']) => void
  deleteGroup: (groupId: string) => void
  setGroups: (groups: Group[]) => void // needed for reordering
  getGroup: (groupId: string) => Group
}

export const createGroupSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): GroupSlice => ({
  groups: [],
  addGroup: (groupName, memberNames) =>
    set(
      produce<PersistedState>(store => {
        const members = memberNames
          .filter(({ name }) => !isEmpty(name))
          .map(({ name }) => ({ id: uuid(), name, timestamp: Date.now() }))
        store.groups.unshift({
          id: uuid(),
          name: groupName,
          members,
          purchases: [],
          incomes: [],
          compensations: [],
          timestamp: Date.now(),
        })
      })
    ),
  editGroupName: (groupId, groupName) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        store.groups[groupIndex].name = groupName
      })
    ),
  deleteGroup: groupId =>
    set(
      produce<PersistedState>(store => {
        store.deleteGroupMembers(groupId)
        store.deleteGroupPurchases(groupId)
        store.deleteGroupIncomes(groupId)
        store.deleteGroupCompensations(groupId)
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        store.groups.splice(groupIndex, 1)
      })
    ),
  setGroups: groups => set({ groups }),
  getGroup: groupId => findItem(groupId, get().groups),
})
