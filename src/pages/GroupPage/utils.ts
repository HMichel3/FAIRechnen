import { Capacitor } from '@capacitor/core'
import { PickedFile } from '@capawesome/capacitor-file-picker'
import { isNotEmpty } from 'ramda'
import { parse } from 'superjson'
import { isLast } from '../../App/utils'
import { Group, GroupSchema } from '../../stores/types'

export const displayMemberQuantity = (memberQuantity: number) =>
  memberQuantity === 1 ? `1 Mitglied` : `${memberQuantity} Mitglieder`

export const displayHistoryQuantity = (historyQuantity: number) =>
  historyQuantity === 1 ? `1 Eintrag` : `${historyQuantity} Einträge`

export const determineLines = (index: number, groups: Group[], groupArchive: Group[]) => {
  if (!isLast(index, groups)) return 'inset'
  if (isNotEmpty(groupArchive)) return 'full'
  return 'none'
}

export const extractGroupFromFile = async (file: PickedFile) => {
  const webPath = Capacitor.convertFileSrc(file.path!)
  const response = await fetch(webPath)
  const content = await response.text()
  const parsedContent = parse(content)
  return GroupSchema.parse(parsedContent)
}
