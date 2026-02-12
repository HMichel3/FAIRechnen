import { v4 as uuidv4 } from 'uuid'
import { NewMember } from '../../App/types'
import { filterDuplicateNames, filterNonEmptyNames, findItem, findItemIndex } from '../../App/utils'
import { Group } from '../types'
import { PersistImmer } from '../usePersistedStore'
import { withMetaData } from '../utils'

export type GroupSlice = {
  groups: Group[]
  groupArchive: Group[]
  addGroup: (groupName: Group['name'], newMembers: NewMember[]) => void
  editGroupName: (groupId: string, groupName: Group['name']) => void
  setGroupFactor: (groupId: string, factor: Group['factor']) => void
  deleteGroup: (groupId: string) => void
  archiveGroup: (groupId: string) => void
  restoreGroup: (groupId: string) => void
  deleteArchivedGroup: (groupId: string) => void
  setGroups: (groups: Group[]) => void // needed for reordering
  getGroup: (groupId: string) => Group
  importNewGroup: (group: Group) => void
  importExistingGroup: (group: Group) => void
  copyImportedGroup: (group: Group) => void
}

export const createGroupSlice: PersistImmer<GroupSlice> = (set, get) => ({
  groups: [],
  groupArchive: [],
  addGroup: (groupName, newMembers) => {
    const { addContacts } = get()
    const filteredNewMembers = filterNonEmptyNames(newMembers)
    const uniqNewMembers = filterDuplicateNames(filteredNewMembers)
    set(store => {
      store.groups.unshift(
        withMetaData({
          name: groupName,
          members: uniqNewMembers.map(withMetaData),
          purchases: [],
          incomes: [],
          compensations: [],
          factor: '1',
        })
      )
    })
    addContacts(uniqNewMembers)
  },
  editGroupName: (groupId, groupName) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groups[groupIndex].name = groupName
    }),
  setGroupFactor: (groupId, groupFactor) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groups[groupIndex].factor = groupFactor
    }),
  deleteGroup: groupId =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groups.splice(groupIndex, 1)
    }),
  archiveGroup: groupId =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groupArchive.push(store.groups[groupIndex])
      store.groups.splice(groupIndex, 1)
    }),
  restoreGroup: groupId =>
    set(store => {
      const groupArchiveIndex = findItemIndex(groupId, store.groupArchive)
      if (groupArchiveIndex === -1) return
      store.groups.unshift(store.groupArchive[groupArchiveIndex])
      store.groupArchive.splice(groupArchiveIndex, 1)
    }),
  deleteArchivedGroup: groupId =>
    set(store => {
      const groupArchiveIndex = findItemIndex(groupId, store.groupArchive)
      if (groupArchiveIndex === -1) return
      store.groupArchive.splice(groupArchiveIndex, 1)
    }),
  setGroups: groups => set({ groups }),
  getGroup: groupId => findItem(groupId, get().groups)!,
  importNewGroup: group =>
    set(store => {
      const groupIndex = findItemIndex(group.id, store.groups)
      if (groupIndex !== -1) return
      store.groups.unshift(group)
    }),
  importExistingGroup: group =>
    set(store => {
      const groupIndex = findItemIndex(group.id, store.groups)
      if (groupIndex === -1) return
      store.groups[groupIndex] = group
    }),
  copyImportedGroup: group =>
    set(store => {
      const groupIndex = findItemIndex(group.id, store.groups)
      if (groupIndex === -1) return
      store.groups.unshift({ ...group, id: uuidv4(), name: `${group.name} (Kopie)` })
    }),
})
