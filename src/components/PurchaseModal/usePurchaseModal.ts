import { zodResolver } from '@hookform/resolvers/zod'
import { pick, map, prop, equals, omit } from 'ramda'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PurchaseModalProps } from '.'
import { Purchase, CompleteMember } from '../../App/types'
import { getTotalAmountFromArray } from '../../App/utils'
import { purchaseDTO } from '../../dtos/purchaseDTO'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Pflichtfeld!' }),
  amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
  purchaserId: z.string().min(1, { message: 'Pflichtfeld!' }),
  beneficiaryIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
  description: z.string(),
  additions: z
    .object({
      name: z.string().min(1, { message: 'Pflichtfeld!' }),
      amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
      payerIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
    })
    .array(),
})

export interface PurchaseFormValues {
  name: Purchase['name']
  amount: Purchase['amount']
  purchaserId: Purchase['purchaserId']
  beneficiaryIds: Purchase['beneficiaryIds']
  description: Purchase['description']
  additions: Purchase['additions']
}

const defaultValues = (groupMembers: CompleteMember[], selectedPurchase?: Purchase): PurchaseFormValues => {
  if (!selectedPurchase) {
    const groupMemberIds = map(prop('memberId'), groupMembers)
    return {
      name: '',
      amount: 0,
      purchaserId: groupMemberIds[0],
      beneficiaryIds: groupMemberIds,
      description: '',
      additions: [],
    }
  }

  return omit(['groupId', 'purchaseId', 'timestamp'], selectedPurchase)
}

export const usePurchaseModal = ({ onDismiss, selectedPurchase }: PurchaseModalProps) => {
  const addPurchase = usePersistedStore.useAddPurchase()
  const editPurchase = usePersistedStore.useEditPurchase()
  const { group, groupMembers } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(groupMembers, selectedPurchase),
  })
  const [showAdditionError, setShowAdditionError] = useState(false)

  const onSubmit = methods.handleSubmit(({ name, amount, purchaserId, beneficiaryIds, description, additions }) => {
    setShowAdditionError(false)
    if (getTotalAmountFromArray(methods.getValues('additions')) > methods.getValues('amount')) {
      return setShowAdditionError(true)
    }
    if (selectedPurchase) {
      const selectedPurchaseData = pick(['groupId', 'purchaseId', 'timestamp'], selectedPurchase)
      const editedPurchase = purchaseDTO({
        ...selectedPurchaseData,
        name,
        amount,
        purchaserId,
        beneficiaryIds,
        description,
        additions,
      })
      if (!equals(selectedPurchase, editedPurchase)) editPurchase(editedPurchase)
    } else {
      const newPurchase = purchaseDTO({
        groupId: group.groupId,
        name,
        amount,
        purchaserId,
        beneficiaryIds,
        description,
        additions,
      })
      addPurchase(newPurchase)
    }
    showAnimationOnce()
    onDismiss()
  })

  return { showAdditionError, setShowAdditionError, methods, onSubmit }
}
