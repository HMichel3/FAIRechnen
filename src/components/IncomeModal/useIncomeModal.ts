import { zodResolver } from '@hookform/resolvers/zod'
import { map, pick, prop } from 'ramda'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { IncomeModalProps } from '.'
import { NewIncome } from '../../App/types'
import { Income, Member } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Pflichtfeld!' }),
  amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
  earnerId: z.string().min(1, { message: 'Pflichtfeld!' }),
  beneficiaryIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
  description: z.string(),
})

const defaultValues = (members: Member[], selectedIncome?: Income): NewIncome => {
  if (!selectedIncome) {
    const memberIds = map(prop('id'), members)
    return {
      name: '',
      amount: 0,
      earnerId: memberIds[0],
      beneficiaryIds: memberIds,
      description: '',
    }
  }

  return pick(['name', 'amount', 'earnerId', 'beneficiaryIds', 'description'], selectedIncome)
}

export const useIncomeModal = ({ onDismiss, selectedIncome }: IncomeModalProps) => {
  const addIncome = usePersistedStore.useAddIncome()
  const editIncome = usePersistedStore.useEditIncome()
  const { id: groupId, members } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const { handleSubmit, formState, control, watch } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedIncome),
  })

  const onSubmit = handleSubmit(newIncome => {
    if (selectedIncome) {
      editIncome(groupId, selectedIncome.id, newIncome)
    } else {
      addIncome(groupId, newIncome)
    }
    showAnimationOnce()
    onDismiss()
  })

  return { onSubmit, errors: formState.errors, control, members, watch }
}
