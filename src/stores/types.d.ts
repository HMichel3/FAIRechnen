export type Group = {
  id: string
  name: string
  members: Member[]
  purchases: Purchase[]
  incomes: Income[]
  compensations: Compensation[]
  timestamp: number
}

export type Member = {
  id: string
  name: string
  timestamp: number
}

export type Purchase = {
  id: string
  name: string
  amount: number
  purchaserId: Member['id']
  beneficiaryIds: Member['id'][]
  description: string
  additions: Addition[]
  memberAmount: number
  timestamp: number
}

export type Addition = {
  name: string
  amount: number
  payerIds: Member['id'][]
  memberAmount: number
}

export type Income = {
  id: string
  name: string
  amount: number
  earnerId: Member['id']
  beneficiaryIds: Member['id'][]
  description: string
  memberAmount: number
  timestamp: number
}

export type Compensation = {
  id: string
  amount: number
  payerId: Member['id']
  receiverId: Member['id']
  timestamp: number
}
