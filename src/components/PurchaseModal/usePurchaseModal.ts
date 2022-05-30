import { zodResolver } from '@hookform/resolvers/zod'
import { map, pick, prop } from 'ramda'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PurchaseModalProps } from '.'
import { NewPurchase } from '../../App/types'
import { getTotalAmountFromArray } from '../../App/utils'
import { Member, Purchase } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  purchaserId: z.string().min(1),
  beneficiaryIds: z.string().array().nonempty(),
  description: z.string(),
  additions: z
    .object({
      name: z.string().trim().min(1),
      amount: z.number().positive(),
      payerIds: z.string().array().nonempty(),
    })
    .array(),
})

const defaultValues = (members: Member[], selectedPurchase?: Purchase): NewPurchase => {
  if (!selectedPurchase) {
    const memberIds = map(prop('id'), members)
    return {
      name: '',
      amount: 0,
      purchaserId: memberIds.at(0)!,
      beneficiaryIds: memberIds,
      description: '',
      additions: [],
    }
  }

  return pick(['name', 'amount', 'purchaserId', 'beneficiaryIds', 'description', 'additions'], selectedPurchase)
}

export const usePurchaseModal = ({ onDismiss, selectedPurchase }: PurchaseModalProps) => {
  const addPurchase = usePersistedStore.useAddPurchase()
  const editPurchase = usePersistedStore.useEditPurchase()
  const { id: groupId, members } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const { handleSubmit, watch, formState, control } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedPurchase),
  })
  const [showAdditionError, setShowAdditionError] = useState(false)

  const onSubmit = handleSubmit(newPurchase => {
    setShowAdditionError(false)
    if (getTotalAmountFromArray(newPurchase.additions) > newPurchase.amount) {
      return setShowAdditionError(true)
    }
    if (selectedPurchase) {
      editPurchase(groupId, selectedPurchase.id, newPurchase)
    } else {
      addPurchase(groupId, newPurchase)
    }
    showAnimationOnce()
    onDismiss()
  })

  return { showAdditionError, setShowAdditionError, onSubmit, watch, errors: formState.errors, control }
}
