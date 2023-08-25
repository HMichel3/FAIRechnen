import { join, sort, descend, prop } from 'ramda'
import { deleteItem, isPositive } from '../../App/utils'
import { CompensationsWithoutTimestamp, MemberWithAmounts } from '../../App/types'

const removeDuplicateCompensations = (compensations: CompensationsWithoutTimestamp[]) => {
  const check = new Set()
  return compensations.filter(obj => !check.has(obj.id) && check.add(obj.id))
}

export const generatePossibleCompensations = (membersWithAmounts: MemberWithAmounts[]) => {
  // filter members, to only contain members with current !== 0, continue if at least 2 members are left
  const possibleMembers = membersWithAmounts.filter(member => member.current !== 0)
  if (possibleMembers.length < 2) return []
  let partner: MemberWithAmounts
  const compensations = possibleMembers.map(member => {
    let minAmountDiff: number
    const membersWithoutCurrentMember = deleteItem(member.id, possibleMembers)
    membersWithoutCurrentMember.forEach(secondMember => {
      if (Math.sign(member.current) === Math.sign(secondMember.current)) return
      const amountDiff = member.current + secondMember.current
      if (amountDiff >= minAmountDiff) return
      minAmountDiff = amountDiff
      partner = secondMember
    })
    const amount = Math.min(Math.abs(member.current), Math.abs(partner.current))
    // sorts the the payer and receiver id and combines it for a unique id (needed for removing duplicates)
    const payerReceiverId = join('--', [partner.id, member.id].sort())
    if (isPositive(member.current)) {
      return { id: payerReceiverId, amount, payerId: partner.id, receiverId: member.id }
    }
    return { id: payerReceiverId, amount, payerId: member.id, receiverId: partner.id }
  })
  const compensationsWithoutDuplicates = removeDuplicateCompensations(compensations)
  return sort(descend(prop('amount')), compensationsWithoutDuplicates)
}
