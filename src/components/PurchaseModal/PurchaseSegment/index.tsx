import { FormComponent } from '../../formComponents/FormComponent'
import { FormInput } from '../../formComponents/FormInput'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { useStore } from '../../../stores/useStore'
import { FormTextarea } from '../../formComponents/FormTextarea'
import { FormRadioGroup } from '../../formComponents/FormRadioGroup'
import { FormChipsComponent } from '../../formComponents/FormChipsComponent'
import { FormCheckboxGroup } from '../../formComponents/FormCheckboxGroup'
import { Control, useFormState } from 'react-hook-form'
import { motion } from 'framer-motion'
import { fadeOutRightVariants, variantProps } from '../../../App/animations'
import { ConvertButton } from './ConvertButton'
import { Dispatch, SetStateAction } from 'react'
import { FormPropertyName } from '..'
import './index.scss'

interface PurchaseSegmentProps {
  control: Control<NewPurchase>
  setShowConvertModal: Dispatch<SetStateAction<FormPropertyName | ''>>
}

export const PurchaseSegment = ({ control, setShowConvertModal }: PurchaseSegmentProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { errors } = useFormState({ control })

  return (
    <motion.div variants={fadeOutRightVariants} {...variantProps}>
      <FormComponent label='Einkaufname*' error={errors.name}>
        <FormInput name='name' control={control} />
      </FormComponent>
      <div className='amount-convert-wrapper'>
        <FormComponent className='flex-1' label='Betrag*' error={errors.amount}>
          <FormCurrency name='amount' control={control} />
        </FormComponent>
        <ConvertButton onClick={() => setShowConvertModal('amount')} />
      </div>
      <FormChipsComponent label='Einkäufer*'>
        <FormRadioGroup name='purchaserId' control={control} selectOptions={members} />
      </FormChipsComponent>
      <FormChipsComponent label='Begünstigte*' error={errors.beneficiaryIds}>
        <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
      </FormChipsComponent>
      <FormComponent label='Beschreibung'>
        <FormTextarea name='description' control={control} />
      </FormComponent>
    </motion.div>
  )
}
