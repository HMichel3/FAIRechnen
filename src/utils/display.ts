import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { difference, hasAtLeast } from 'remeda'
import { Group, Member } from '../types/store'
import { isLast } from './guard'

export const displayMemberQuantity = (memberQuantity: number) =>
  memberQuantity === 1 ? `1 Mitglied` : `${memberQuantity} Mitglieder`

export const displayHistoryQuantity = (historyQuantity: number) =>
  historyQuantity === 1 ? `1 Eintrag` : `${historyQuantity} Einträge`

export const determineLines = (index: number, groups: Group[], groupArchive: Group[]) => {
  if (!isLast(index, groups)) return 'inset'
  if (hasAtLeast(groupArchive, 1)) return 'full'
  return 'none'
}

export const displayCurrencyValue = (value: number) =>
  (value / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })

export const displayCurrencyValueNoSign = (value: number) => displayCurrencyValue(value).slice(0, -2)

export const displayTimestamp = (timestamp: number, options?: { noYear?: boolean; noTime?: boolean }) => {
  let formatString = 'dd.MM.y, HH:mm'
  if (options?.noYear) {
    formatString = 'dd.MM. • HH:mm'
  }
  if (options?.noTime) {
    formatString = 'dd.MM.y'
  }
  return format(timestamp, formatString, { locale: de })
}

export const displayBeneficiaryNames = (beneficiaries: Member[], members: Member[], additionPayers?: Member[]) => {
  const isForAllMembers = difference(members, beneficiaries).length === 0
  if (isForAllMembers) return 'Alle'
  const beneficiaryNames = beneficiaries.map(m => m.name)
  const additionalNames = additionPayers?.map(({ name }) => `(${name})`) ?? []
  return [...beneficiaryNames, ...additionalNames].join(', ')
}

export const displayAdditionQuantity = (additionQuantity: number) =>
  additionQuantity === 1 ? '1 Zusatz' : `${additionQuantity} Zusätze`
