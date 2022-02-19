import { isEmpty, join, map } from 'ramda'
import { CompleteMember, CompleteGroup } from '../../App/types'
import { displayCurrencyValue, findItemById, updateArrayItemById } from '../../App/utils'
import { AlmostCompensation } from '../../components/AddCompensationModal/useAddCompensationModal'
import { generatePossibleCompensations } from '../../components/AddCompensationModal/utils'

const generateOnePossibleCompensationChain = (groupMembers: CompleteMember[]) => {
  const addedCompensations: AlmostCompensation[] = []

  const editMemberAmount = (memberId: CompleteMember['memberId'], amount: AlmostCompensation['amount']) => {
    const member = findItemById(memberId, groupMembers, 'memberId')
    const newMember = { ...member, amount: member.amount + amount }
    groupMembers = updateArrayItemById(memberId, newMember, groupMembers, 'memberId')
  }

  for (let result; (result = generatePossibleCompensations(groupMembers)); ) {
    if (isEmpty(result)) break
    const { amount, payerId, receiverId } = result[0]
    editMemberAmount(payerId, amount)
    editMemberAmount(receiverId, -amount)
    addedCompensations.push(result[0])
  }

  return addedCompensations
}

export const generateBill = (group: CompleteGroup, members: CompleteMember[]) => {
  const groupOverviewExplanation = [
    `*Gruppe: ${group.name}*`,
    `*Gesamtausgaben: ${displayCurrencyValue(group.totalAmount)}*`,
    '_Name_ | _Ausgaben_ | _Ausstehend_',
    '----------------------------------------',
  ]
  const groupOverview = map(({ name, amount, totalAmount }) => {
    const memberTotal = displayCurrencyValue(totalAmount)
    const memberCurrent = displayCurrencyValue(amount)
    return `${name} | ${memberTotal} | ${memberCurrent}`
  }, members)
  const completeGroupOverview = [...groupOverviewExplanation, ...groupOverview, '']

  const generatedCompensationChain = generateOnePossibleCompensationChain(members)

  if (isEmpty(generatedCompensationChain)) return join('\n', completeGroupOverview)

  const compensationProposalExplanation = [
    '*Zahlungsvorschlag*',
    '_Zahler_ --> _Betrag_ --> _Empfänger_',
    '----------------------------------------',
  ]
  const compensationProposal = map(({ amount, payerId, receiverId }) => {
    const payer = findItemById(payerId, members, 'memberId')
    const receiver = findItemById(receiverId, members, 'memberId')
    return `${payer.name} --> ${displayCurrencyValue(amount)} --> ${receiver.name}`
  }, generatedCompensationChain)

  const completeCompensationProposal = [...compensationProposalExplanation, ...compensationProposal]

  return join('\n', [...completeGroupOverview, ...completeCompensationProposal])
}
