import { isEmpty } from 'ramda'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Compensation } from '../../../App/types'
import { removeArrayItemsById } from '../../../App/utils'
import { useStore } from '../../../stores/useStore'
import { AddManualCompensationProps } from '../AddManualCompensation'

interface CompensationFormValues {
  payerId: Compensation['payerId']
  receiverId: Compensation['receiverId']
  amount: Compensation['amount']
}

const defaultValues: CompensationFormValues = { payerId: '', receiverId: '', amount: 0 }

export const useAddManualCompensation = (
  setManualCompensation: AddManualCompensationProps['setManualCompensation']
) => {
  const { groupMembers } = useStore.useSelectedGroup()
  const { watch, setValue, control } = useForm({ defaultValues })
  const membersWithoutPayer = removeArrayItemsById(watch('payerId'), groupMembers)

  useEffect(() => {
    const adjustReceiverId = watch(({ payerId, receiverId }, { name }) => {
      if (name !== 'payerId' || payerId !== receiverId) return
      setValue('receiverId', '')
    })
    const saveCompensation = watch(({ payerId, receiverId, amount }) => {
      if (isEmpty(payerId) || isEmpty(receiverId) || amount <= 0) return setManualCompensation(null)
      setManualCompensation({ payerId, receiverId, amount })
    })
    return () => {
      adjustReceiverId.unsubscribe()
      saveCompensation.unsubscribe()
    }
  }, [watch, setManualCompensation, setValue])

  return { groupMembers, membersWithoutPayer, control }
}
