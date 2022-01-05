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
  const { register, watch, setValue, control } = useForm({ defaultValues })
  const payerId = watch('payerId')
  const membersWithoutPayer = removeArrayItemsById(payerId, groupMembers)

  useEffect(() => {
    const saveCompensation = watch(data => {
      if (isEmpty(data.payerId) || isEmpty(data.receiverId) || data.amount <= 0) return setManualCompensation(null)
      setManualCompensation(data)
    })
    const adjustReceiverId = watch(({ payerId, receiverId }, { name }) => {
      if (name !== 'payerId' || isEmpty(payerId)) return
      payerId === receiverId && setValue('receiverId', '')
    })
    return () => {
      saveCompensation.unsubscribe()
      adjustReceiverId.unsubscribe()
    }
  }, [watch, setManualCompensation, setValue])

  return { groupMembers, membersWithoutPayer, register, control }
}
