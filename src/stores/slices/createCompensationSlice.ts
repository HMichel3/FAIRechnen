import { PersistImmer } from '../usePersistedStore'
import { v4 as uuid } from 'uuid'
import produce from 'immer'
import { findItemIndex } from '../../App/utils'

export interface CompensationSlice {
  addCompensation: (groupId: string, newCompensation: NewCompensation) => void
  deleteCompensation: (groupId: string, compensationId: string) => void
}

export const createCompensationSlice: PersistImmer<CompensationSlice> = set => ({
  addCompensation: (groupId, newCompensation) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      store.groups[groupIndex].compensations.push(
        produce(newCompensation as Compensation, draft => {
          draft['id'] = uuid()
          draft['timestamp'] = Date.now()
        })
      )
    }),
  deleteCompensation: (groupId, compensationId) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const compensationIndex = findItemIndex(compensationId, store.groups[groupIndex].compensations)
      if (compensationIndex === -1) return
      store.groups[groupIndex].compensations.splice(compensationIndex, 1)
    }),
})
