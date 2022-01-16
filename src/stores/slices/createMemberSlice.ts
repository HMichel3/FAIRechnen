import { append, or, filter, concat, map } from 'ramda'
import { GetState, SetState } from 'zustand'
import { memberDTO } from '../../dtos/memberDTO'
import { Addition, Compensation, Group, Member, Purchase } from '../../App/types'
import {
  getArrayItemById,
  getArrayItemsByGroupId,
  getArrayItemsByIds,
  getTotalAmountFromArray,
  removeArrayItemsById,
  updateArrayItemById,
} from '../../App/utils'
import { PersistedState } from '../usePersistedStore'
import { checkCompensationParticipation, checkPurchaseParticipation } from '../utils'
import { nor } from 'ramda-adjunct'

export interface MemberSlice {
  members: Member[]
  // holds the deleted members, if they are involved in purchases or compensations
  deletedMembers: Member[]
  addMember: (groupId: Group['id'], memberName: Member['name']) => void
  editMemberName: (memberId: Member['id'], newMemberName: Member['name']) => void
  editMemberAmount: (memberId: Member['id'], newMemberAmount: Member['amount']) => void
  adjustPurchaseAmountOnMembers: (
    purchaseAmount: Purchase['amount'],
    purchasePurchaserId: Purchase['purchaserId'],
    purchaseBeneficiaryIds: Purchase['beneficiaryIds']
  ) => Purchase['amount']
  adjustAdditionsAmountsOnMembers: (
    additions: Addition[],
    purchaserId: Purchase['purchaserId'],
    deleting?: boolean
  ) => [Addition['amount'], Addition[]]
  adjustCompensationAmountOnMembers: (
    compensationAmount: Compensation['amount'],
    compensationPayerId: Compensation['payerId'],
    compensationReceiverId: Compensation['receiverId']
  ) => void
  deleteMember: (memberId: Member['id']) => void
  deleteDeletedMembersAfterCheck: (memberIds: Member['id'][]) => void
  deleteGroupMembers: (groupId: Group['id']) => void
  getGroupMembers: (groupId: Group['id']) => Member[]
  getMemberById: (memberId: Member['id']) => Member
  getMembersByIds: (memberIds: Member['id'][]) => Member[]
}

export const createMemberSlice = (set: SetState<PersistedState>, get: GetState<PersistedState>): MemberSlice => ({
  members: [],
  deletedMembers: [],
  addMember: (groupId, memberName) => {
    const member = memberDTO(groupId, memberName)
    set({ members: append(member, get().members) })
  },
  editMemberName: (memberId, newMemberName) => {
    const member = getArrayItemById(memberId, get().members)
    const newMember = { ...member, name: newMemberName }
    set({ members: updateArrayItemById(memberId, newMember, get().members) })
  },
  editMemberAmount: (memberId, newMemberAmount) => {
    const member = getArrayItemById(memberId, get().members)
    const newMember = { ...member, amount: member.amount + newMemberAmount }
    set({ members: updateArrayItemById(memberId, newMember, get().members) })
  },
  adjustPurchaseAmountOnMembers: (purchaseAmount, purchasePurchaserId, purchaseBeneficiaryIds) => {
    const memberCount = purchaseBeneficiaryIds.length
    const memberPurchaseAmount = Math.round(purchaseAmount / memberCount)
    purchaseBeneficiaryIds.forEach(beneficiaryId => {
      get().editMemberAmount(beneficiaryId, -memberPurchaseAmount)
    })
    // ensures that only purchases can be created, which can be divided smoothly
    const newPurchaseAmount = memberPurchaseAmount * memberCount
    get().editMemberAmount(purchasePurchaserId, newPurchaseAmount)
    return Math.abs(newPurchaseAmount)
  },
  adjustAdditionsAmountsOnMembers: (additions, purchaserId, deleting = false) => {
    const newAdditions: Addition[] = map(addition => {
      const newAdditionAmount = get().adjustPurchaseAmountOnMembers(
        deleting ? -addition.amount : addition.amount,
        purchaserId,
        addition.beneficiaryIds
      )
      return { ...addition, amount: newAdditionAmount }
    }, additions)
    const newAdditionsTotalAmount = getTotalAmountFromArray(deleting ? additions : newAdditions)
    return [newAdditionsTotalAmount, newAdditions]
  },
  adjustCompensationAmountOnMembers: (compensationAmount, compensationPayerId, compensationReceiverId) => {
    get().editMemberAmount(compensationPayerId, compensationAmount)
    get().editMemberAmount(compensationReceiverId, -compensationAmount)
  },
  deleteMember: memberId => {
    const isMemberStillNeeded = or(
      checkPurchaseParticipation(memberId, get().purchases),
      checkCompensationParticipation(memberId, get().compensations)
    )
    if (isMemberStillNeeded) {
      const member = getArrayItemById(memberId, get().members)
      set({ deletedMembers: append(member, get().deletedMembers) })
    }
    set({ members: removeArrayItemsById(memberId, get().members) })
  },
  // deletes the deleted members, if they are not involved in another purchase or compensation
  deleteDeletedMembersAfterCheck: memberIds => {
    const notInvolvedIds = filter(
      memberId =>
        nor(
          checkPurchaseParticipation(memberId, get().purchases),
          checkCompensationParticipation(memberId, get().compensations)
        ) as boolean,
      memberIds
    )
    notInvolvedIds.forEach(notInvolvedId => {
      set({ deletedMembers: removeArrayItemsById(notInvolvedId, get().deletedMembers) })
    })
  },
  deleteGroupMembers: groupId => {
    set({ members: removeArrayItemsById(groupId, get().members, 'groupId') })
    set({ deletedMembers: removeArrayItemsById(groupId, get().deletedMembers, 'groupId') })
  },
  getGroupMembers: groupId => {
    return getArrayItemsByGroupId(groupId, get().members)
  },
  getMemberById: memberId => {
    return or(getArrayItemById(memberId, get().members), getArrayItemById(memberId, get().deletedMembers))
  },
  getMembersByIds: memberIds => {
    return concat(getArrayItemsByIds(memberIds, get().members), getArrayItemsByIds(memberIds, get().deletedMembers))
  },
})
