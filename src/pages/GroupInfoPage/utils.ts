import { isEmpty, join } from 'ramda'
import { CompensationsWithoutTimestamp } from '../../App/types'
import { calculateGroupTotalAmount, displayCurrencyValue, displayCurrencyValueNoSign, findItem } from '../../App/utils'
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

const formatPaymentSuggestions = (members: Member[], compensationChain: CompensationsWithoutTimestamp[]) => {
  if (isEmpty(compensationChain)) return []
  const formattedSuggestions = compensationChain.map(({ amount, payerId, receiverId }) => {
    const payer = findItem(payerId, members)
    const receiver = findItem(receiverId, members)
    return {
      payerName: payer.name,
      receiverName: receiver.name,
      amountString: displayCurrencyValueNoSign(amount),
    }
  })
  const payerLength = Math.max(PAYER_HEADER.length, ...formattedSuggestions.map(({ payerName }) => payerName.length))
  const amountLength = Math.max(
    AMOUNT_HEADER.length,
    ...formattedSuggestions.map(({ amountString }) => amountString.length)
  )
  const header = [
    PAYER_HEADER.padEnd(payerLength),
    ARROW,
    AMOUNT_HEADER.padStart(amountLength),
    ARROW,
    RECEIVER_HEADER,
  ].join('')
  const suggestionRows = formattedSuggestions.map(({ payerName, amountString, receiverName }) => {
    const payerPart = payerName.padEnd(payerLength)
    const amountPart = amountString.padStart(amountLength)
    return [payerPart, ARROW, amountPart, ARROW, receiverName].join('')
  })
  const maxRowLength = Math.max(header.length, ...suggestionRows.map(row => row.length))
  const separatorLine = '-'.repeat(maxRowLength)
  return ['*Zahlungsvorschläge*', monospace(header), monospace(separatorLine), ...suggestionRows.map(monospace)]
}

export const generateBillText = (
  groupName: SelectedGroup['name'],
  members: Member[],
  purchases: Purchase[],
  incomes: Income[],
  compensations: Compensation[],
  compensationChain: CompensationsWithoutTimestamp[]
) => {
  const groupOverview = formatGroupOverview(groupName, members, purchases, incomes, compensations)
  const paymentSuggestions = formatPaymentSuggestions(members, compensationChain)
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
