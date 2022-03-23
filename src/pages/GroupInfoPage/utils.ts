import produce from 'immer'
import { isEmpty, join } from 'ramda'
import { CompensationsWithoutTimestamp, MemberWithAmounts } from '../../App/types'
import {
  calculateGroupTotalAmount,
  calculateMembersWithAmounts,
  displayCurrencyValue,
  findItem,
  findItemIndex,
} from '../../App/utils'
import { generatePossibleCompensations } from '../../components/AddCompensationModal/utils'
import { Compensation, Group, Income, Member, Purchase } from '../../stores/types'

const generateOnePossibleCompensationChain = (membersWithAmounts: MemberWithAmounts[]) => {
  const addedCompensations: CompensationsWithoutTimestamp[] = []
  for (let result; (result = generatePossibleCompensations(membersWithAmounts)); ) {
    if (isEmpty(result)) break
    const { amount, payerId, receiverId } = result[0]
    membersWithAmounts = produce(membersWithAmounts, draft => {
      const payerIndex = findItemIndex(payerId, draft)
      const receiverIndex = findItemIndex(receiverId, draft)
      if (payerIndex === -1 || receiverIndex === -1) return
      draft[payerIndex].current += amount
      draft[receiverIndex].current += -amount
    })
    addedCompensations.push(result[0])
  }
  return addedCompensations
}

export const generateBill = (
  groupName: Group['name'],
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) => {
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)
  const groupTotalAmount = calculateGroupTotalAmount(purchases, incomes)

  const groupOverviewExplanation = [
    `*Gruppe: ${groupName}*`,
    `*Gesamtausgaben: ${displayCurrencyValue(groupTotalAmount)}*`,
    '_Name_ | _Ausgaben_ | _Ausstehend_',
    '----------------------------------------',
  ]
  const groupOverview = membersWithAmounts.map(
    ({ name, current, total }) => `${name} | ${displayCurrencyValue(total)} | ${displayCurrencyValue(current)}`
  )
  const completeGroupOverview = [...groupOverviewExplanation, ...groupOverview, '']

  const generatedCompensationChain = generateOnePossibleCompensationChain(membersWithAmounts)

  if (isEmpty(generatedCompensationChain)) return join('\n', completeGroupOverview)

  const compensationProposalExplanation = [
    '*Zahlungsvorschlag*',
    '_Zahler_ --> _Betrag_ --> _Empfänger_',
    '----------------------------------------',
  ]
  const compensationProposal = generatedCompensationChain.map(({ amount, payerId, receiverId }) => {
    const payer = findItem(payerId, members)
    const receiver = findItem(receiverId, members)
    return `${payer.name} --> ${displayCurrencyValue(amount)} --> ${receiver.name}`
  })
  const completeCompensationProposal = [...compensationProposalExplanation, ...compensationProposal]

  return join('\n', [...completeGroupOverview, ...completeCompensationProposal])
}
