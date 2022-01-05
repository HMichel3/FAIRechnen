import { Group, Member } from '../App/types'
import { v4 as uuid } from 'uuid'

export const memberDTO = (groupId: Group['id'], memberName: Member['name']): Member => ({
  groupId: groupId,
  id: uuid(),
  name: memberName,
  amount: 0,
})
