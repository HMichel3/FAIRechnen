import { FormInput } from '../../formComponents/FormInput'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { useStore } from '../../../stores/useStore'
import { FormTextarea } from '../../formComponents/FormTextarea'
import { FormRadioGroup } from '../../formComponents/FormRadioGroup'
import { FormCheckboxGroup } from '../../formComponents/FormCheckboxGroup'
import { Control, useFormState } from 'react-hook-form'
import { motion } from 'framer-motion'
import { fadeOutRightVariants, variantProps } from '../../../App/animations'
import { ConvertButton } from './ConvertButton'
import { Dispatch, SetStateAction } from 'react'
import { FormPropertyName } from '..'
import { IonLabel } from '@ionic/react'
import { NewPurchase } from '../../../App/types'
import { cn } from '../../../App/utils'

interface PurchaseSegmentProps {
  control: Control<NewPurchase>
  setShowConvertModal: Dispatch<SetStateAction<FormPropertyName | ''>>
}

export const PurchaseSegment = ({ control, setShowConvertModal }: PurchaseSegmentProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { errors } = useFormState({ control })

  return (
    <motion.div className='my-2 flex flex-col gap-2' variants={fadeOutRightVariants} {...variantProps}>
      <FormInput label='Einkaufname*' name='name' control={control} />
      <div className='flex'>
        <FormCurrency label='Betrag*' name='amount' control={control} />
        <ConvertButton onClick={() => setShowConvertModal('amount')} />
      </div>
      <div className='flex flex-col border-b border-[#898989] bg-[#1e1e1e] px-4 py-2'>
        <IonLabel>Einkäufer*</IonLabel>
        <FormRadioGroup name='purchaserId' control={control} selectOptions={members} />
      </div>
      <div
        className={cn('flex flex-col border-b border-[#898989] bg-[#1e1e1e] px-4 py-2', {
          'border-[#eb445a]': errors.beneficiaryIds,
        })}
      >
        <IonLabel color={cn({ danger: errors.beneficiaryIds })}>Begünstigte*</IonLabel>
        <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
      </div>
      <FormTextarea label='Beschreibung' name='description' control={control} />
    </motion.div>
  )
}
