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

const defaultValues = (members: Member[], selectedPurchase?: Purchase): NewPurchase => {
  if (!selectedPurchase) {
    const memberIds = map(prop('id'), members)
    return {
      name: '',
      amount: 0,
      purchaserId: memberIds[0],
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
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedPurchase),
  })
  const [showAdditionError, setShowAdditionError] = useState(false)

  const onSubmit = methods.handleSubmit(newPurchase => {
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

  return { showAdditionError, setShowAdditionError, methods, onSubmit }
}
