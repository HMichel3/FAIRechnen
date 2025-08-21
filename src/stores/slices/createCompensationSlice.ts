import { produce } from 'immer'
import { NewCompensation } from '../../App/types'
import { findItemIndex } from '../../App/utils'
import { Compensation } from '../types'
import { PersistImmer } from '../usePersistedStore'

export type CompensationSlice = {
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
          draft['id'] = crypto.randomUUID()
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
