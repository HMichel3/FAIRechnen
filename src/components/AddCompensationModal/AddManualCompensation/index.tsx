import { motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import { fadeInOutTopVariants, variantProps } from '../../../App/animations'
import { CompensationWithoutIdsAndTimeStamp } from '../../../dtos/compensationDTO'
import { useAddManualCompensation } from './useAddManualCompensation'
import { FormComponent } from '../../formComponents/FormComponent'
import { FormSelect } from '../../formComponents/FormSelect'
import { FormCurrency } from '../../formComponents/FormCurrency'

export interface AddManualCompensationProps {
  setManualCompensation: Dispatch<SetStateAction<CompensationWithoutIdsAndTimeStamp | null>>
}

export const AddManualCompensation = ({ setManualCompensation }: AddManualCompensationProps): JSX.Element => {
  const { groupMembers, membersWithoutPayer, control } = useAddManualCompensation(setManualCompensation)

  return (
    <motion.div style={{ marginLeft: 72, marginRight: 16 }} variants={fadeInOutTopVariants} {...variantProps}>
      <FormComponent label='Zahler' noMargin>
        <FormSelect name='payerId' selectOptions={groupMembers} control={control} />
      </FormComponent>
      <FormComponent label='Empfänger' noMargin>
        <FormSelect name='receiverId' selectOptions={membersWithoutPayer} control={control} />
      </FormComponent>
      <FormComponent label='Betrag' noMargin>
        <FormCurrency name='amount' control={control} />
      </FormComponent>
    </motion.div>
  )
}
