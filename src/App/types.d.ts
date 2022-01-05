export interface Group {
  id: string
  name: string
}

export interface Member {
  groupId: Group['id']
  id: string
  name: string
  amount: number
}

export interface Purchase {
  groupId: Group['id']
  id: string
  timestamp: number
  name: string
  amount: number
  purchaserId: Member['id']
  beneficiaryIds: Member['id'][]
  isPurchaserOnlyPaying: boolean
  additions: Addition[]
}

export interface Addition {
  name: string
  amount: number
  beneficiaryIds: Member['id'][]
}

export interface Compensation {
  groupId: Group['id']
  id: string
  timestamp: number
  amount: number
  payerId: Member['id']
  receiverId: Member['id']
}

export interface SelectedGroup {
  group: Group
  groupMembers: Member[]
  groupPurchases: Purchase[]
  groupCompensations: Compensation[]
  groupPayments: (Purchase | Compensation)[]
}
