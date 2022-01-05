import { append, pair } from 'ramda'
import { GetState, SetState } from 'zustand'
import { Compensation, Group } from '../../App/types'
import { getArrayItemById, getArrayItemsByGroupId, removeArrayItemsById } from '../../App/utils'
import { PersistedState } from '../usePersistedStore'
import { checkIfAllCompensationInvolvedExist } from '../utils'

export interface CompensationSlice {
  compensations: Compensation[]
  addCompensation: (compensation: Compensation) => void
  deleteCompensation: (compensationId: Compensation['id']) => void
  deleteGroupCompensations: (groupId: Group['id']) => void
  getGroupCompensations: (groupId: Group['id']) => Compensation[]
}

export const createCompensationSlice = (
  set: SetState<PersistedState>,
  get: GetState<PersistedState>
): CompensationSlice => ({
  compensations: [],
  addCompensation: compensation => {
    const { amount, payerId, receiverId } = compensation
    get().adjustCompensationAmountOnMembers(amount, payerId, receiverId)
    set({ compensations: append(compensation, get().compensations) })
  },
  deleteCompensation: compensationId => {
    const { amount, payerId, receiverId } = getArrayItemById(compensationId, get().compensations)
    if (checkIfAllCompensationInvolvedExist(payerId, receiverId, get().members)) {
      // negative amount, because it gets deleted
      get().adjustCompensationAmountOnMembers(-amount, payerId, receiverId)
    }
    set({ compensations: removeArrayItemsById(compensationId, get().compensations) })
    get().deleteDeletedMembersAfterCheck(pair(payerId, receiverId))
  },
  deleteGroupCompensations: groupId => {
    set({ compensations: removeArrayItemsById(groupId, get().compensations, 'groupId') })
  },
  getGroupCompensations: groupId => {
    return getArrayItemsByGroupId(groupId, get().compensations)
  },
})
