import { GetState, SetState } from 'zustand'
import { Compensation, Group } from '../../App/types'
import { findItemsById, removeItemsById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'

export interface CompensationSlice {
  compensations: Compensation[]
  addCompensation: (compensation: Compensation) => void
  deleteCompensation: (compensationId: Compensation['compensationId']) => void
  deleteGroupCompensations: (groupId: Group['groupId']) => void
  getGroupCompensations: (groupId: Group['groupId']) => Compensation[]
}

export const createCompensationSlice = (
  set: SetState<PersistedState>,
  get: GetState<PersistedState>
): CompensationSlice => ({
  compensations: [],
  addCompensation: compensation => set(s => ({ compensations: [...s.compensations, compensation] })),
  deleteCompensation: compensationId =>
    set(s => ({ compensations: removeItemsById(compensationId, s.compensations, 'compensationId') })),
  deleteGroupCompensations: groupId =>
    set(s => ({ compensations: removeItemsById(groupId, s.compensations, 'groupId') })),
  getGroupCompensations: groupId => findItemsById(groupId, get().compensations, 'groupId'),
})
