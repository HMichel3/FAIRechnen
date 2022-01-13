import { isEmpty } from 'ramda'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Compensation } from '../../../App/types'
import { removeArrayItemsById } from '../../../App/utils'
import { useStore } from '../../../stores/useStore'
import { AddManualCompensationProps } from '../AddManualCompensation'

interface FormValues {
  payerId: Compensation['payerId']
  receiverId: Compensation['receiverId']
  amount: Compensation['amount']
}

const defaultValues: FormValues = { payerId: '', receiverId: '', amount: 0 }

export const useAddManualCompensation = (
  setManualCompensation: AddManualCompensationProps['setManualCompensation']
) => {
  const { groupMembers } = useStore.useSelectedGroup()
  const { watch, setValue, control } = useForm({ defaultValues })
  const payerId = watch('payerId')
  const receiverId = watch('receiverId')
  const amount = watch('amount')
  const membersWithoutPayer = removeArrayItemsById(payerId, groupMembers)

  useEffect(() => {
    if (payerId !== receiverId) return
    setValue('receiverId', '')
  }, [payerId, receiverId, setValue])

  useEffect(() => {
    if (isEmpty(payerId) || isEmpty(receiverId) || amount <= 0) return setManualCompensation(null)
    setManualCompensation({ payerId, receiverId, amount })
  }, [payerId, receiverId, amount, setManualCompensation])

  return { groupMembers, membersWithoutPayer, control }
}
