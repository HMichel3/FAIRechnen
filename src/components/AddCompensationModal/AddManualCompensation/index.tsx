import { motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import { fadeInOutTopVariants, variantProps } from '../../../App/animations'
import { CompensationWithoutIdsAndTimeStamp } from '../../../dtos/compensationDTO'
import { Select } from '../../formComponents/Select'
import { CurrencyInput } from '../../formComponents/CurrencyInput'
import { useAddManualCompensation } from './useAddManualCompensation'

export interface AddManualCompensationProps {
  setManualCompensation: Dispatch<SetStateAction<CompensationWithoutIdsAndTimeStamp | null>>
}

export const AddManualCompensation = ({ setManualCompensation }: AddManualCompensationProps): JSX.Element => {
  const { groupMembers, membersWithoutPayer, register, control } = useAddManualCompensation(setManualCompensation)

  return (
    <motion.div style={{ marginLeft: 72 }} variants={fadeInOutTopVariants} {...variantProps}>
      <Select label='Zahler' placeholder='Zahler auswählen' selectOptions={groupMembers} {...register('payerId')} />
      <Select
        label='Empfänger'
        placeholder='Empfänger auswählen'
        selectOptions={membersWithoutPayer}
        {...register('receiverId')}
      />
      <CurrencyInput label='Betrag' name='amount' control={control} lines='none' />
    </motion.div>
  )
}
