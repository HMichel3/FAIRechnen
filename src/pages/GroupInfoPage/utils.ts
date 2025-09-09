import { join, reduce } from 'ramda'
import {
  calculateGroupTotalAmount,
  calculateMembersWithAmounts,
  displayCurrencyValue,
  displayCurrencyValueNoSign,
  findItem,
} from '../../App/utils'
import { generateCompensationChain } from '../../components/AddCompensationModal/utils'
import { Compensation, Income, Member, Purchase, SelectedGroup } from '../../stores/types'
import { displayHistoryQuantity, displayMemberQuantity } from '../GroupPage/utils'

const PAYER_HEADER = 'Zahler'
const AMOUNT_HEADER = 'Betrag'
const RECEIVER_HEADER = 'Empfänger'
const ARROW = ' > '

const formatGroupOverview = (
  groupName: SelectedGroup['name'],
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) => {
  const memberCount = members.length
  const historyCount = purchases.length + incomes.length + compensations.length
  const groupTotalAmount = calculateGroupTotalAmount(purchases, incomes)
  return [
    `*${groupName}*`,
    `👤 ${displayMemberQuantity(memberCount)}`,
    `📄 ${displayHistoryQuantity(historyCount)}`,
    `💎 ${displayCurrencyValue(groupTotalAmount)}`,
  ]
}

const monospace = (text: string) => '```' + text + '```'

const formatPaymentSuggestions = (
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) => {
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)
  const generatedCompensationChain = generateCompensationChain(membersWithAmounts)
  const suggestions = generatedCompensationChain.map(({ amount, payerId, receiverId }) => {
    const payer = findItem(payerId, members)
    const receiver = findItem(receiverId, members)
    return { payer: payer.name, amount, receiver: receiver.name }
  })
  const payerLength = reduce(
    (maxLength, { payer }) => {
      if (payer.length > maxLength) return payer.length
      return maxLength
    },
    PAYER_HEADER.length,
    suggestions
  )
  const amountLength = reduce(
    (maxLength, { amount }) => {
      const formattedAmount = displayCurrencyValueNoSign(amount)
      if (formattedAmount.length > maxLength) return formattedAmount.length
      return maxLength
    },
    AMOUNT_HEADER.length,
    suggestions
  )
  const formattedPayerHeader = PAYER_HEADER.padEnd(payerLength)
  const formattedAmountHeader = AMOUNT_HEADER.padStart(amountLength)
  const headerLine = `${formattedPayerHeader}${ARROW}${formattedAmountHeader}${ARROW}${RECEIVER_HEADER}`
  let maxRowLength = headerLine.length
  const suggestionsList = suggestions.map(({ payer, amount, receiver }) => {
    const payerPart = payer.padEnd(payerLength)
    const amountPart = displayCurrencyValueNoSign(amount).padStart(amountLength)
    const suggestionRow = `${payerPart}${ARROW}${amountPart}${ARROW}${receiver}`
    if (suggestionRow.length > maxRowLength) {
      maxRowLength = suggestionRow.length
    }
    return monospace(suggestionRow)
  })
  const separatorLine = '-'.repeat(maxRowLength)
  return ['*Zahlungsvorschläge*', monospace(headerLine), monospace(separatorLine), ...suggestionsList]
}

export const generateBillText = (
  groupName: SelectedGroup['name'],
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[]
) => {
  const groupOverview = formatGroupOverview(groupName, members, purchases, incomes, compensations)
  const paymentSuggestions = formatPaymentSuggestions(members, purchases, incomes, compensations)
  return join('\n', [...groupOverview, '', ...paymentSuggestions])
}

export const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result!.toString().split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
