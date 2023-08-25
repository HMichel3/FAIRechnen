import { motion } from 'framer-motion'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { fadeInOutTopVariants, variantProps } from '../../../App/animations'
import { FormSelect } from '../../formComponents/FormSelect'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { useStore } from '../../../stores/useStore'
import { useForm, useWatch } from 'react-hook-form'
import { deleteItem } from '../../../App/utils'
import { isEmpty } from 'ramda'
import { NewCompensation } from '../../../App/types'
import { Compensation } from '../../../stores/types'

interface AddManualCompensationProps {
  setManualCompensation: Dispatch<SetStateAction<NewCompensation | null>>
}

interface CompensationFormValues {
  payerId: Compensation['payerId']
  receiverId: Compensation['receiverId']
  amount: Compensation['amount']
}

const defaultValues: CompensationFormValues = { payerId: '', receiverId: '', amount: 0 }

export const AddManualCompensation = ({ setManualCompensation }: AddManualCompensationProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { setValue, control } = useForm({ defaultValues })
  const payerId = useWatch({ control, name: 'payerId' })
  const receiverId = useWatch({ control, name: 'receiverId' })
  const amount = useWatch({ control, name: 'amount' })
  const membersWithoutPayer = deleteItem(payerId, members)
  const isPayerEqualToReceiver = payerId === receiverId

  useEffect(() => {
    if (isPayerEqualToReceiver) setValue('receiverId', '')
  }, [isPayerEqualToReceiver, setValue])

  useEffect(() => {
    if (isEmpty(payerId) || isEmpty(receiverId) || amount <= 0) return setManualCompensation(null)
    setManualCompensation({ payerId, receiverId, amount })
  }, [amount, payerId, receiverId, setManualCompensation])

  return (
    <motion.div variants={fadeInOutTopVariants} {...variantProps}>
      <FormSelect label='Zahler' name='payerId' selectOptions={members} control={control} />
      <FormSelect label='Empfänger' name='receiverId' selectOptions={membersWithoutPayer} control={control} />
      <FormCurrency label='Betrag' name='amount' control={control} />
    </motion.div>
  )
}
