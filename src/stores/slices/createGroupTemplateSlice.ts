import produce from 'immer'
import { SetState } from 'zustand'
import { findItemIndex } from '../../App/utils'
import { GroupTemplate } from '../types'
import { PersistedState } from '../usePersistedStore'
import { v4 as uuid } from 'uuid'

export interface GroupTemplateSlice {
  groupTemplates: GroupTemplate[]
  addGroupTemplate: (groupName: GroupTemplate['name'], memberNames: GroupTemplate['memberNames']) => string
  deleteGroupTemplate: (groupTemplateId: string) => void
}

export const createGroupTemplateSlice = (set: SetState<PersistedState>): GroupTemplateSlice => ({
  groupTemplates: [],
  addGroupTemplate: (groupName, memberNames) => {
    const id = uuid()
    set(
      produce<PersistedState>(store => {
        store.groupTemplates.push({ id, name: groupName, memberNames, timestamp: Date.now() })
      })
    )
    return id
  },
  deleteGroupTemplate: groupTemplateId =>
    set(
      produce<PersistedState>(store => {
        const groupTemplateIndex = findItemIndex(groupTemplateId, store.groupTemplates)
        if (groupTemplateIndex === -1) return
        store.groupTemplates.splice(groupTemplateIndex, 1)
      })
    ),
})
