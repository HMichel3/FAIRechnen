import { CopyWithPartial, Income } from '../App/types'
import { v4 as uuid } from 'uuid'

type IncomeDTO = CopyWithPartial<Income, 'incomeId' | 'timestamp'>

export const incomeDTO = (income: IncomeDTO): Income => ({
  groupId: income.groupId,
  incomeId: income.incomeId ?? uuid(),
  timestamp: income.timestamp ?? Date.now(),
  name: income.name,
  amount: income.amount,
  earnerId: income.earnerId,
  beneficiaryIds: income.beneficiaryIds,
})
