import { Income } from '../App/types'
import { v4 as uuid } from 'uuid'

export type IncomeWithoutIdAndTimeStamp = Omit<Income, 'id' | 'timestamp'>

export const incomeDTO = (income: IncomeWithoutIdAndTimeStamp): Income => ({
  groupId: income.groupId,
  id: uuid(),
  timestamp: Date.now(),
  name: income.name,
  amount: income.amount,
  earnerId: income.earnerId,
  beneficiaryIds: income.beneficiaryIds,
  isEarnerOnlyEarning: income.isEarnerOnlyEarning,
})
