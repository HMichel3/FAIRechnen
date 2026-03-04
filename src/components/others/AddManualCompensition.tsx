import { motion } from 'motion/react'
import { isEmpty } from 'ramda'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useStore } from '../../stores/useStore'
import { NewCompensation } from '../../types/common'
import { Compensation } from '../../types/store'
import { fadeInOutTopVariants } from '../../utils/animation'
import { deleteItem } from '../../utils/common'
import { FormCurrency } from '../ui/formComponents/FormCurrency'
import { FormSelect } from '../ui/formComponents/FormSelect'

type AddManualCompensationProps = {
  setManualCompensation: Dispatch<SetStateAction<NewCompensation | null>>
}

type CompensationFormValues = {
  payerId: Compensation['payerId']
  receiverId: Compensation['receiverId']
  amount: Compensation['amount']
}

const defaultValues: CompensationFormValues = { payerId: '', receiverId: '', amount: 0 }

export const AddManualCompensation = ({ setManualCompensation }: AddManualCompensationProps) => {
  const { members } = useStore(s => s.selectedGroup)
  const { setValue, control } = useForm({ defaultValues })
  const payerId = useWatch({ control, name: 'payerId' })
  const receiverId = useWatch({ control, name: 'receiverId' })
  const amount = useWatch({ control, name: 'amount' })
  const membersWithoutPayer = deleteItem(payerId, members)
  const isPayerEqualToReceiver = payerId === receiverId

  useEffect(() => {
    if (isPayerEqualToReceiver) {
      setValue('receiverId', '')
    }
  }, [isPayerEqualToReceiver, setValue])

  useEffect(() => {
    if (isEmpty(payerId) || isEmpty(receiverId) || amount <= 0) {
      setManualCompensation(null)
      return
    }
    setManualCompensation({ payerId, receiverId, amount })
  }, [amount, payerId, receiverId, setManualCompensation])

  return (
    <motion.div className='bg-[var(--ion-item-background)] pl-9' {...fadeInOutTopVariants}>
      <FormSelect label='Zahler' name='payerId' selectOptions={members} control={control} />
      <FormSelect label='Empfänger' name='receiverId' selectOptions={membersWithoutPayer} control={control} />
      <FormCurrency label='Betrag' name='amount' control={control} />
    </motion.div>
  )
}
