import { zodResolver } from '@hookform/resolvers/zod'
import { pick, map, prop, equals, includes, reject } from 'ramda'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PurchaseModalProps } from '.'
import { Purchase, CompleteMember } from '../../App/types'
import { addIdToBeneficiariesIfNeeded, getTotalAmountFromArray } from '../../App/utils'
import { purchaseDTO } from '../../dtos/purchaseDTO'
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
      payerIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
    })
    .array(),
})

export interface PurchaseFormValues {
  name: Purchase['name']
  amount: Purchase['amount']
  purchaserId: Purchase['purchaserId']
  beneficiaryIds: Purchase['beneficiaryIds']
  isPurchaserOnlyPaying: boolean
  additions: Purchase['additions']
}

const defaultValues = (groupMembers: CompleteMember[], selectedPurchase?: Purchase): PurchaseFormValues => {
  if (!selectedPurchase) {
    const groupMemberIds = map(prop('memberId'), groupMembers)
    return {
      name: '',
      amount: 0,
      purchaserId: '',
      beneficiaryIds: groupMemberIds,
      isPurchaserOnlyPaying: false,
      additions: [],
    }
  }

  const { name, amount, purchaserId, beneficiaryIds, additions } = selectedPurchase
  // the payer could be included into the beneficiaries (we don't want this here)
  const beneficiaryIdsWithoutPurchaser = reject(equals(purchaserId), beneficiaryIds)
  return {
    name,
    amount,
    purchaserId,
    beneficiaryIds: beneficiaryIdsWithoutPurchaser,
    isPurchaserOnlyPaying: !includes(purchaserId, beneficiaryIds),
    additions,
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

  const onSubmit = methods.handleSubmit(
    ({ name, amount, purchaserId, beneficiaryIds, isPurchaserOnlyPaying, additions }) => {
      setShowAdditionError(false)
      if (getTotalAmountFromArray(methods.getValues('additions')) > methods.getValues('amount')) {
        return setShowAdditionError(true)
      }
      const completeBeneficiaryIds = addIdToBeneficiariesIfNeeded(purchaserId, beneficiaryIds, isPurchaserOnlyPaying)
      if (selectedPurchase) {
        const neededSelectedPurchaseData = pick(['groupId', 'purchaseId', 'timestamp'], selectedPurchase)
        const editedPurchase = purchaseDTO({
          ...neededSelectedPurchaseData,
          name,
          amount,
          purchaserId,
          beneficiaryIds: completeBeneficiaryIds,
          additions,
        })
        if (!equals(selectedPurchase, editedPurchase)) editPurchase(editedPurchase)
      } else {
        const newPurchase = purchaseDTO({
          groupId: group.groupId,
          name,
          amount,
          purchaserId,
          beneficiaryIds: completeBeneficiaryIds,
          additions,
        })
        addPurchase(newPurchase)
      }
      showAnimationOnce()
      onDismiss()
    }
  )

  return { showAdditionError, setShowAdditionError, methods, onSubmit }
}
