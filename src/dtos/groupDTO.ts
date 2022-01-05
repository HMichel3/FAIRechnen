import { Group } from '../App/types'
import { v4 as uuid } from 'uuid'

export const groupDTO = (groupName: Group['name']): Group => ({
  id: uuid(),
  name: groupName,
})
