type GeneralInformation = {
  id: string
  timestamp: number
}

type Group = GeneralInformation & {
  name: string
  members: Member[]
  purchases: Purchase[]
  incomes: Income[]
  compensations: Compensation[]
}

type Member = GeneralInformation & {
  name: string
}

type Purchase = GeneralInformation & {
  name: string
  amount: number
  purchaserId: Member['id']
  beneficiaryIds: Member['id'][]
  description: string
  additions: Addition[]
  memberAmount: number
}

type Addition = {
  name: string
  amount: number
  payerIds: Member['id'][]
  memberAmount: number
}

type Income = GeneralInformation & {
  name: string
  amount: number
  earnerId: Member['id']
  beneficiaryIds: Member['id'][]
  description: string
  memberAmount: number
}

type Compensation = GeneralInformation & {
  amount: number
  payerId: Member['id']
  receiverId: Member['id']
}

type SelectedGroup = Group & {
  membersWithAmounts: MemberWithAmounts[]
  sortedPayments: Payment[]
}

type Theme = 'dark' | 'white'
