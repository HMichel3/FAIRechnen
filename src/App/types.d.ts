type MemberWithAmounts = Member & {
  current: number
  total: number
}

type Payment = Purchase | Compensation | Income

type NewAddition = Pick<Addition, 'name' | 'amount' | 'payerIds'>

type NewPurchase = Pick<Purchase, 'name' | 'amount' | 'purchaserId' | 'beneficiaryIds' | 'description'> & {
  additions: NewAddition[]
}

type NewIncome = Pick<Income, 'name' | 'amount' | 'earnerId' | 'beneficiaryIds' | 'description'>

type NewCompensation = Pick<Compensation, 'amount' | 'payerId' | 'receiverId'>

type CompensationsWithoutTimestamp = Pick<Compensation, 'id' | 'amount' | 'payerId' | 'receiverId'>

type ReactHookFormOnChange = (...event: any[]) => void
