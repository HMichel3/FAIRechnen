import { zodResolver } from '@hookform/resolvers/zod'
import { pick, map, prop, equals } from 'ramda'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PurchaseModalProps } from '.'
import { Purchase, Member } from '../../App/types'
import { getTotalAmountFromArray } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Pflichtfeld!' }),
  amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
  purchaserId: z.string().min(1, { message: 'Pflichtfeld!' }),
  beneficiaryIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
  isPurchaserOnlyPaying: z.boolean(),
  additions: z
    .object({
      name: z.string().min(1, { message: 'Pflichtfeld!' }),
      amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
      beneficiaryIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
    })
    .array(),
})

export interface PurchaseFormValues {
  name: Purchase['name']
  amount: Purchase['amount']
  purchaserId: Purchase['purchaserId']
  beneficiaryIds: Purchase['beneficiaryIds']
  isPurchaserOnlyPaying: Purchase['isPurchaserOnlyPaying']
  additions: Purchase['additions']
}

const defaultValues = (groupMembers: Member[], selectedPurchase?: Purchase): PurchaseFormValues => {
  const groupMemberIds = map(prop('id'), groupMembers)
  return {
    name: selectedPurchase?.name ?? '',
    amount: selectedPurchase?.amount ?? 0,
    purchaserId: selectedPurchase?.purchaserId ?? '',
    beneficiaryIds: selectedPurchase?.beneficiaryIds ?? groupMemberIds,
    isPurchaserOnlyPaying: selectedPurchase?.isPurchaserOnlyPaying ?? false,
    additions: selectedPurchase?.additions ?? [],
  }
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

  const onSubmit = methods.handleSubmit(data => {
    setShowAdditionError(false)
    if (getTotalAmountFromArray(methods.getValues('additions')) > methods.getValues('amount')) {
      return setShowAdditionError(true)
    }
    if (selectedPurchase) {
      const neededSelectedPurchaseData = pick(['groupId', 'id', 'timestamp'], selectedPurchase)
      const newPurchase = { ...neededSelectedPurchaseData, ...data }
      if (!equals(selectedPurchase, newPurchase)) {
        editPurchase(selectedPurchase.id, selectedPurchase, newPurchase)
      }
    } else {
      addPurchase({ groupId: group.id, ...data })
    }
    showAnimationOnce()
    onDismiss()
  })

  return { showAdditionError, setShowAdditionError, methods, onSubmit }
}
