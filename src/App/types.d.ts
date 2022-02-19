export interface Group {
  groupId: string
  timestamp: number
  name: string
}

export interface Member {
  groupId: Group['groupId']
  memberId: string
  timestamp: number
  name: string
}

export interface Purchase {
  groupId: Group['groupId']
  purchaseId: string
  timestamp: number
  name: string
  amount: number
  purchaserId: Member['memberId']
  beneficiaryIds: Member['memberId'][]
  additions: Addition[]
}

export interface Addition {
  name: string
  amount: number
  payerIds: Member['memberId'][]
}

export interface Compensation {
  groupId: Group['groupId']
  compensationId: string
  timestamp: number
  amount: number
  payerId: Member['memberId']
  receiverId: Member['memberId']
}

export interface Income {
  groupId: Group['groupId']
  incomeId: string
  timestamp: number
  name: string
  amount: number
  earnerId: Member['memberId']
  beneficiaryIds: Member['memberId'][]
}

export interface CompleteGroup extends Group {
  totalAmount: number
}

export interface CompleteMember extends Member {
  amount: number
  totalAmount: number
  involved: boolean
}

export interface SelectedGroup {
  group: CompleteGroup
  groupMembers: CompleteMember[]
  groupPayments: (Purchase | Compensation | Income)[]
}

// creates a copy of T, but makes K optional
export type CopyWithPartial<T, K extends keyof T> = Omit<T, K> & Partial<T>
