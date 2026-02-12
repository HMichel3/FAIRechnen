import { NewCompensation } from '../../App/types'
import { findItemIndex } from '../../App/utils'
import { PersistImmer } from '../usePersistedStore'
import { withMetaData } from '../utils'

export type CompensationSlice = {
  addCompensation: (groupId: string, newCompensation: NewCompensation) => void
  deleteCompensation: (groupId: string, compensationId: string) => void
  addCompensations: (groupId: string, newCompensations: NewCompensation[]) => void
}

export const createCompensationSlice: PersistImmer<CompensationSlice> = set => ({
  addCompensation: (groupId, newCompensation) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const compensation = withMetaData(newCompensation)
      store.groups[groupIndex].compensations.push(compensation)
    }),
  deleteCompensation: (groupId, compensationId) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const compensationIndex = findItemIndex(compensationId, store.groups[groupIndex].compensations)
      if (compensationIndex === -1) return
      store.groups[groupIndex].compensations.splice(compensationIndex, 1)
    }),
  addCompensations: (groupId, newCompensations) =>
    set(store => {
      const groupIndex = findItemIndex(groupId, store.groups)
      if (groupIndex === -1) return
      const compensations = newCompensations.map(withMetaData)
      store.groups[groupIndex].compensations.push(...compensations.toReversed())
    }),
})
