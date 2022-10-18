import { FormComponent } from '../../formComponents/FormComponent'
import { FormInput } from '../../formComponents/FormInput'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { path } from 'ramda'
import { useStore } from '../../../stores/useStore'
import { FormTextarea } from '../../formComponents/FormTextarea'
import { FormRadioGroup } from '../../formComponents/FormRadioGroup'
import { FormChipsComponent } from '../../formComponents/FormChipsComponent'
import { FormCheckboxGroup } from '../../formComponents/FormCheckboxGroup'
import { Control, useFormState } from 'react-hook-form'
import { NewPurchase } from '../../../App/types'
import { motion } from 'framer-motion'
import { fadeOutRightVariants, variantProps } from '../../../App/animations'

interface PurchaseSegmentProps {
  control: Control<NewPurchase>
}

export const PurchaseSegment = ({ control }: PurchaseSegmentProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { errors } = useFormState({ control })

  return (
    <motion.div variants={fadeOutRightVariants} {...variantProps}>
      <FormComponent label='Einkaufname*' error={errors.name}>
        <FormInput name='name' control={control} />
      </FormComponent>
      <FormComponent label='Betrag*' error={errors.amount}>
        <FormCurrency name='amount' control={control} />
      </FormComponent>
      <FormChipsComponent label='Einkäufer*'>
        <FormRadioGroup name='purchaserId' control={control} selectOptions={members} />
      </FormChipsComponent>
      <FormChipsComponent label='Begünstigte*' error={path(['beneficiaryIds'], errors)}>
        <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
      </FormChipsComponent>
      <FormComponent label='Beschreibung'>
        <FormTextarea name='description' control={control} />
      </FormComponent>
    </motion.div>
  )
}
