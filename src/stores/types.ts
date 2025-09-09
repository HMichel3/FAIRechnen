import { MemberWithAmounts, Payment } from '../App/types'

export type GeneralInformation = {
  id: string
  timestamp: number
}

export type Group = GeneralInformation & {
  name: string
  members: Member[]
  purchases: Purchase[]
  incomes: Income[]
  compensations: Compensation[]
  factor: string
}

export type Member = GeneralInformation & {
  name: string
}

export type Purchase = GeneralInformation & {
  name: string
  amount: number
  purchaserId: Member['id']
  beneficiaryIds: Member['id'][]
  description: string
  additions: Addition[]
  memberAmount: number
}

export type Addition = {
  name: string
  amount: number
  payerIds: Member['id'][]
  memberAmount: number
}

export type Income = GeneralInformation & {
  name: string
  amount: number
  earnerId: Member['id']
  beneficiaryIds: Member['id'][]
  description: string
  memberAmount: number
}

export type Compensation = GeneralInformation & {
  amount: number
  payerId: Member['id']
  receiverId: Member['id']
}

export type SelectedGroup = Group & {
  membersWithAmounts: MemberWithAmounts[]
  sortedPayments: Payment[]
}

export type Theme = 'dark' | 'white'
