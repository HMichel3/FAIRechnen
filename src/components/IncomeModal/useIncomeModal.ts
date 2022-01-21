import { zodResolver } from '@hookform/resolvers/zod'
import { map, prop, pick, equals, isEmpty, includes, without } from 'ramda'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { IncomeModalProps } from '.'
import { Income, Member } from '../../App/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Pflichtfeld!' }),
  amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
  earnerId: z.string().min(1, { message: 'Pflichtfeld!' }),
  beneficiaryIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
  isEarnerOnlyEarning: z.boolean(),
})

interface IncomeFormValues {
  name: Income['name']
  amount: Income['amount']
  earnerId: Income['earnerId']
  beneficiaryIds: Income['beneficiaryIds']
  isEarnerOnlyEarning: Income['isEarnerOnlyEarning']
}

const defaultValues = (groupMembers: Member[], selectedIncome?: Income): IncomeFormValues => {
  const groupMemberIds = map(prop('id'), groupMembers)
  return {
    name: selectedIncome?.name ?? '',
    amount: selectedIncome?.amount ?? 0,
    earnerId: selectedIncome?.earnerId ?? '',
    beneficiaryIds: selectedIncome?.beneficiaryIds ?? groupMemberIds,
    isEarnerOnlyEarning: selectedIncome?.isEarnerOnlyEarning ?? false,
  }
}

export const useIncomeModal = ({ onDismiss, selectedIncome }: IncomeModalProps) => {
  const addIncome = usePersistedStore.useAddIncome()
  const editIncome = usePersistedStore.useEditIncome()
  const { group, groupMembers } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const { handleSubmit, formState, control, watch, setValue } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(groupMembers, selectedIncome),
  })

  useEffect(() => {
    const adjustBeneficiaryIds = watch(({ earnerId, beneficiaryIds }, { name }) => {
      if (name !== 'earnerId' || isEmpty(earnerId) || !includes(earnerId, beneficiaryIds)) return
      setValue('beneficiaryIds', without([earnerId], beneficiaryIds))
    })
    return () => adjustBeneficiaryIds.unsubscribe()
  }, [watch, setValue])

  const onSubmit = handleSubmit(data => {
    if (selectedIncome) {
      const neededSelectedIncomeData = pick(['groupId', 'id', 'timestamp'], selectedIncome)
      const newIncome = { ...neededSelectedIncomeData, ...data }
      if (!equals(selectedIncome, newIncome)) {
        editIncome(selectedIncome.id, selectedIncome, newIncome)
      }
    } else {
      addIncome({ groupId: group.id, ...data })
    }
    showAnimationOnce()
    onDismiss()
  })

  return { onSubmit, errors: formState.errors, control, groupMembers, watch }
}
