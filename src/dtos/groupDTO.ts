import { CopyWithPartial, Group } from '../App/types'
import { v4 as uuid } from 'uuid'
import { trim } from 'ramda'

type GroupDTO = CopyWithPartial<Group, 'groupId' | 'timestamp'>

export const groupDTO = (group: GroupDTO): Group => ({
  groupId: group.groupId ?? uuid(),
  timestamp: group.timestamp ?? Date.now(),
  name: trim(group.name),
})
