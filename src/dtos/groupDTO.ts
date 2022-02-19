import { CopyWithPartial, Group } from '../App/types'
import { v4 as uuid } from 'uuid'

type GroupDTO = CopyWithPartial<Group, 'groupId' | 'timestamp'>

export const groupDTO = (group: GroupDTO): Group => ({
  groupId: group.groupId ?? uuid(),
  timestamp: group.timestamp ?? Date.now(),
  name: group.name,
})
