import { Compensation, CopyWithPartial } from '../App/types'
import { v4 as uuid } from 'uuid'

type CompensationDTO = CopyWithPartial<Compensation, 'compensationId' | 'timestamp'>

export const compensationDTO = (compensation: CompensationDTO): Compensation => ({
  groupId: compensation.groupId,
  compensationId: compensation.compensationId ?? uuid(),
  timestamp: compensation.timestamp ?? Date.now(),
  amount: compensation.amount,
  payerId: compensation.payerId,
  receiverId: compensation.receiverId,
})
