import { SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'
import { v4 as uuid } from 'uuid'
import produce from 'immer'
import { NewCompensation } from '../../App/types'
import { findItemIndex } from '../../App/utils'
import { Compensation } from '../types'

export interface CompensationSlice {
  addCompensation: (groupId: string, newCompensation: NewCompensation) => void
  deleteCompensation: (groupId: string, compensationId: string) => void
}

export const createCompensationSlice = (set: SetState<PersistedState>): CompensationSlice => ({
  addCompensation: (groupId, newCompensation) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        store.groups[groupIndex].compensations.push(
          produce(newCompensation as Compensation, draft => {
            draft['id'] = uuid()
            draft['timestamp'] = Date.now()
          })
        )
      })
    ),
  deleteCompensation: (groupId, compensationId) =>
    set(
      produce<PersistedState>(store => {
        const groupIndex = findItemIndex(groupId, store.groups)
        if (groupIndex === -1) return
        const compensationIndex = findItemIndex(compensationId, store.groups[groupIndex].compensations)
        if (compensationIndex === -1) return
        store.groups[groupIndex].compensations.splice(compensationIndex, 1)
      })
    ),
})
