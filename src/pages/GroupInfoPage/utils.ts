import { produce } from 'immer'
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
import { Compensation, Income, Member, Purchase, SelectedGroup } from '../../stores/types'
import { displayHistoryQuantity, displayMemberQuantity } from '../GroupPage/utils'

const generateOnePossibleCompensationChain = (membersWithAmounts: MemberWithAmounts[]) => {
  const addedCompensations: CompensationsWithoutTimestamp[] = []
  for (let result; (result = generatePossibleCompensations(membersWithAmounts)); ) {
    if (isEmpty(result)) break
    const { amount, payerId, receiverId } = result.at(0)!
    membersWithAmounts = produce(membersWithAmounts, draft => {
      const payerIndex = findItemIndex(payerId, draft)
      const receiverIndex = findItemIndex(receiverId, draft)
      if (payerIndex === -1 || receiverIndex === -1) return
      draft[payerIndex].current += amount
      draft[receiverIndex].current += -amount
    })
    addedCompensations.push(result.at(0)!)
  }
  return addedCompensations
}

export const generateBillText = (
  groupName: SelectedGroup['name'],
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) => {
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)
  const groupTotalAmount = calculateGroupTotalAmount(purchases, incomes)
  const groupOverviewExplanation = [
    `*${groupName}*`,
    `👤 ${displayMemberQuantity(members.length)}`,
    `📄 ${displayHistoryQuantity(purchases.length + incomes.length + compensations.length)}`,
    `💎 ${displayCurrencyValue(groupTotalAmount)}`,
  ]
  const completeGroupOverview = [...groupOverviewExplanation, '']
  const generatedCompensationChain = generateOnePossibleCompensationChain(membersWithAmounts)
  const compensationProposalExplanation = [
    '*Zahlungsvorschläge*',
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

export const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result!.toString().split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
