import { isNotEmpty } from 'ramda'
import { Group } from '../types/store'
import { isLast } from './common'

export const displayMemberQuantity = (memberQuantity: number) =>
  memberQuantity === 1 ? `1 Mitglied` : `${memberQuantity} Mitglieder`

export const displayHistoryQuantity = (historyQuantity: number) =>
  historyQuantity === 1 ? `1 Eintrag` : `${historyQuantity} Einträge`

export const determineLines = (index: number, groups: Group[], groupArchive: Group[]) => {
  if (!isLast(index, groups)) return 'inset'
  if (isNotEmpty(groupArchive)) return 'full'
  return 'none'
}
