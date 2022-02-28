import { zodResolver } from '@hookform/resolvers/zod'
import { map, prop, pick, equals, isEmpty, includes, without, reject } from 'ramda'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { IncomeModalProps } from '.'
import { Income, CompleteMember } from '../../App/types'
import { addIdToBeneficiariesIfNeeded } from '../../App/utils'
import { incomeDTO } from '../../dtos/incomeDTO'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Pflichtfeld!' }),
  amount: z.number().positive({ message: 'Der Betrag muss größer als 0 sein!' }),
  earnerId: z.string().min(1, { message: 'Pflichtfeld!' }),
  beneficiaryIds: z.string().array().nonempty({ message: 'Pflichtfeld!' }),
  isEarnerOnlyEarning: z.boolean(),
  description: z.string(),
})

interface IncomeFormValues {
  name: Income['name']
  amount: Income['amount']
  earnerId: Income['earnerId']
  beneficiaryIds: Income['beneficiaryIds']
  isEarnerOnlyEarning: boolean
  description: Income['description']
}

const defaultValues = (groupMembers: CompleteMember[], selectedIncome?: Income): IncomeFormValues => {
  if (!selectedIncome) {
    const groupMemberIds = map(prop('memberId'), groupMembers)
    return {
      name: '',
      amount: 0,
      earnerId: '',
      beneficiaryIds: groupMemberIds,
      isEarnerOnlyEarning: false,
      description: '',
    }
  }

  const { name, amount, earnerId, beneficiaryIds, description } = selectedIncome
  // the earner could be included into the beneficiaries (we don't want this here)
  const beneficiaryIdsWithoutEarner = reject(equals(earnerId), beneficiaryIds)
  return {
    name,
    amount,
    earnerId,
    beneficiaryIds: beneficiaryIdsWithoutEarner,
    isEarnerOnlyEarning: !includes(earnerId, beneficiaryIds),
    description,
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

  const onSubmit = handleSubmit(({ name, amount, earnerId, beneficiaryIds, isEarnerOnlyEarning, description }) => {
    const completeBeneficiaryIds = addIdToBeneficiariesIfNeeded(earnerId, beneficiaryIds, isEarnerOnlyEarning)
    if (selectedIncome) {
      const neededSelectedIncomeData = pick(['groupId', 'incomeId', 'timestamp'], selectedIncome)
      const editedIncome = incomeDTO({
        ...neededSelectedIncomeData,
        name,
        amount,
        earnerId,
        beneficiaryIds: completeBeneficiaryIds,
        description,
      })
      if (!equals(selectedIncome, editedIncome)) editIncome(editedIncome)
    } else {
      const newIncome = incomeDTO({
        groupId: group.groupId,
        name,
        amount,
        earnerId,
        beneficiaryIds: completeBeneficiaryIds,
        description,
      })
      addIncome(newIncome)
    }
    showAnimationOnce()
    onDismiss()
  })

  return { onSubmit, errors: formState.errors, control, groupMembers, watch }
}
