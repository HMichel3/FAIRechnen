import { filter, equals, join, sort, descend, prop } from 'ramda'
import { isPositive } from 'ramda-adjunct'
import { CompleteMember } from '../../App/types'
import { removeItemsById } from '../../App/utils'
import { AlmostCompensation } from './useAddCompensationModal'

const removeDuplicateCompensations = (compensations: AlmostCompensation[]) => {
  const check = new Set()
  return compensations.filter(obj => !check.has(obj.payerReceiverId) && check.add(obj.payerReceiverId))
}

export const generatePossibleCompensations = (groupMembers: CompleteMember[]) => {
  // filter groupMembers, to only contain members with amount !== 0, continue if at least 2 members are left
  const possibleGroupMembers = filter(member => !equals(member.amount, 0), groupMembers)
  if (possibleGroupMembers.length < 2) return []
  let compensations: AlmostCompensation[] = []
  let partner: CompleteMember
  possibleGroupMembers.forEach(member => {
    let minAmountDiff: number
    const membersWithoutCurrent = removeItemsById(member.memberId, possibleGroupMembers, 'memberId')
    membersWithoutCurrent.forEach(secondMember => {
      if (Math.sign(member.amount) === Math.sign(secondMember.amount)) return
      const amountDiff = member.amount + secondMember.amount
      if (amountDiff >= minAmountDiff) return
      minAmountDiff = amountDiff
      partner = secondMember
    })
    const amount = Math.min(Math.abs(member.amount), Math.abs(partner.amount))
    // sorts the the payer and receiver id and combines it for a unique id (needed for removing duplicates)
    const payerReceiverId = join('--', [partner.memberId, member.memberId].sort())
    if (isPositive(member.amount)) {
      return compensations.push({ payerReceiverId, amount, payerId: partner.memberId, receiverId: member.memberId })
    }
    compensations.push({ payerReceiverId, amount, payerId: member.memberId, receiverId: partner.memberId })
  })
  const compensationsWithoutDuplicates = removeDuplicateCompensations(compensations)
  return sort(descend(prop('amount')), compensationsWithoutDuplicates)
}
