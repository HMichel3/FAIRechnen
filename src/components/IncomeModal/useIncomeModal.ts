import { zodResolver } from '@hookform/resolvers/zod'
import { map, prop, pick, equals, omit } from 'ramda'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { IncomeModalProps } from '.'
import { Income, CompleteMember } from '../../App/types'
import { incomeDTO } from '../../dtos/incomeDTO'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Pflichtfeld!' }),
  amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
  earnerId: z.string().min(1, { message: 'Pflichtfeld!' }),
  beneficiaryIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
  description: z.string(),
})

interface IncomeFormValues {
  name: Income['name']
  amount: Income['amount']
  earnerId: Income['earnerId']
  beneficiaryIds: Income['beneficiaryIds']
  description: Income['description']
}

const defaultValues = (groupMembers: CompleteMember[], selectedIncome?: Income): IncomeFormValues => {
  if (!selectedIncome) {
    const groupMemberIds = map(prop('memberId'), groupMembers)
    return {
      name: '',
      amount: 0,
      earnerId: groupMemberIds[0],
      beneficiaryIds: groupMemberIds,
      description: '',
    }
  }

  return omit(['groupId', 'incomeId', 'timestamp'], selectedIncome)
}

export const useIncomeModal = ({ onDismiss, selectedIncome }: IncomeModalProps) => {
  const addIncome = usePersistedStore.useAddIncome()
  const editIncome = usePersistedStore.useEditIncome()
  const { group, groupMembers } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const { handleSubmit, formState, control, watch } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(groupMembers, selectedIncome),
  })

  const onSubmit = handleSubmit(({ name, amount, earnerId, beneficiaryIds, description }) => {
    if (selectedIncome) {
      const selectedIncomeData = pick(['groupId', 'incomeId', 'timestamp'], selectedIncome)
      const editedIncome = incomeDTO({ ...selectedIncomeData, name, amount, earnerId, beneficiaryIds, description })
      if (!equals(selectedIncome, editedIncome)) editIncome(editedIncome)
    } else {
      const newIncome = incomeDTO({ groupId: group.groupId, name, amount, earnerId, beneficiaryIds, description })
      addIncome(newIncome)
    }
    showAnimationOnce()
    onDismiss()
  })

  return { onSubmit, errors: formState.errors, control, groupMembers, watch }
}
