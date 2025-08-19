import { Addition, Compensation, Income, Member, Purchase } from '../stores/types'

export type MemberWithAmounts = Member & {
  current: number
  total: number
}

export type Payment = Purchase | Compensation | Income

export type NewAddition = Pick<Addition, 'name' | 'amount' | 'payerIds'>

export type NewPurchase = Pick<Purchase, 'name' | 'amount' | 'purchaserId' | 'beneficiaryIds' | 'description'> & {
  additions: NewAddition[]
}

export type NewIncome = Pick<Income, 'name' | 'amount' | 'earnerId' | 'beneficiaryIds' | 'description'>

export type NewCompensation = Pick<Compensation, 'amount' | 'payerId' | 'receiverId'>

export type CompensationsWithoutTimestamp = Pick<Compensation, 'id' | 'amount' | 'payerId' | 'receiverId'>

export type ReactHookFormOnChange = (...event: unknown[]) => void
