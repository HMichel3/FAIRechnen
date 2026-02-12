import z from 'zod'
import { MemberWithAmounts, Payment } from '../App/types'

export type Theme = 'dark' | 'white'

export type SelectedGroup = Group & {
  membersWithAmounts: MemberWithAmounts[]
  sortedPayments: Payment[]
}

export const MetaDataSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
})

export const MemberSchema = MetaDataSchema.extend({
  name: z.string(),
  payPalMe: z.string().default(''), // default needed for group import of old groups with members without payPalMe
})

export const AdditionSchema = z.object({
  name: z.string(),
  amount: z.number(),
  payerIds: z.string().array(),
  memberAmount: z.number(),
})

export const PurchaseSchema = MetaDataSchema.extend({
  name: z.string(),
  amount: z.number(),
  purchaserId: z.string(),
  beneficiaryIds: z.string().array(),
  description: z.string(),
  additions: AdditionSchema.array(),
  memberAmount: z.number(),
})

export const IncomeSchema = MetaDataSchema.extend({
  name: z.string(),
  amount: z.number(),
  earnerId: z.string(),
  beneficiaryIds: z.string().array(),
  description: z.string(),
  memberAmount: z.number(),
})

export const CompensationSchema = MetaDataSchema.extend({
  amount: z.number(),
  payerId: z.string(),
  receiverId: z.string(),
})

export const GroupSchema = MetaDataSchema.extend({
  name: z.string(),
  members: MemberSchema.array(),
  purchases: PurchaseSchema.array(),
  incomes: IncomeSchema.array(),
  compensations: CompensationSchema.array(),
  factor: z.string(),
})

export type MetaData = z.infer<typeof MetaDataSchema>
export type Member = z.infer<typeof MemberSchema>
export type Addition = z.infer<typeof AdditionSchema>
export type Purchase = z.infer<typeof PurchaseSchema>
export type Income = z.infer<typeof IncomeSchema>
export type Compensation = z.infer<typeof CompensationSchema>
export type Group = z.infer<typeof GroupSchema>
