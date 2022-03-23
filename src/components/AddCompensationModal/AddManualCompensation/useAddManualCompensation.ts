import { isEmpty } from 'ramda'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AddManualCompensationProps } from '.'
import { deleteItem } from '../../../App/utils'
import { Compensation } from '../../../stores/types'
import { useStore } from '../../../stores/useStore'

interface CompensationFormValues {
  payerId: Compensation['payerId']
  receiverId: Compensation['receiverId']
  amount: Compensation['amount']
}

const defaultValues: CompensationFormValues = { payerId: '', receiverId: '', amount: 0 }

export const useAddManualCompensation = (
  setManualCompensation: AddManualCompensationProps['setManualCompensation']
) => {
  const { members } = useStore.useSelectedGroup()
  const { watch, setValue, control } = useForm({ defaultValues })
  const payerId = watch('payerId')
  const receiverId = watch('receiverId')
  const amount = watch('amount')
  const membersWithoutPayer = deleteItem(payerId, members)
  const isPayerEqualToReceiver = payerId === receiverId

  useEffect(() => {
    if (isPayerEqualToReceiver) setValue('receiverId', '')
  }, [isPayerEqualToReceiver, setValue])

  useEffect(() => {
    if (isEmpty(payerId) || isEmpty(receiverId) || amount <= 0) return setManualCompensation(null)
    setManualCompensation({ payerId, receiverId, amount })
  }, [amount, payerId, receiverId, setManualCompensation])

  return { members, membersWithoutPayer, control }
}
