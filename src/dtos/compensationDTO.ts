import { Compensation, Group } from '../App/types'
import { v4 as uuid } from 'uuid'

export type CompensationWithoutIdsAndTimeStamp = Omit<Compensation, 'id' | 'groupId' | 'timestamp'>

export const compensationDTO = (
  groupId: Group['id'],
  compensationAmount: Compensation['amount'],
  compensationPayerId: Compensation['payerId'],
  compensationReceiverId: Compensation['receiverId']
): Compensation => ({
  groupId: groupId,
  id: uuid(),
  timestamp: Date.now(),
  amount: compensationAmount,
  payerId: compensationPayerId,
  receiverId: compensationReceiverId,
})
