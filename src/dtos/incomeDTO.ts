import { CopyWithPartial, Income } from '../App/types'
import { v4 as uuid } from 'uuid'
import { trim } from 'ramda'

type IncomeDTO = CopyWithPartial<Income, 'incomeId' | 'timestamp'>

export const incomeDTO = (income: IncomeDTO): Income => ({
  groupId: income.groupId,
  incomeId: income.incomeId ?? uuid(),
  timestamp: income.timestamp ?? Date.now(),
  name: trim(income.name),
  amount: income.amount,
  earnerId: income.earnerId,
  beneficiaryIds: income.beneficiaryIds,
  description: income.description,
})
