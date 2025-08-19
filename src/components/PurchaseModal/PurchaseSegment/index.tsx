import { IonLabel } from '@ionic/react'
import { motion } from 'motion/react'
import { Dispatch, SetStateAction } from 'react'
import { Control, useFormState } from 'react-hook-form'
import { PurchaseFormPropertyName } from '..'
import { fadeOutRightVariants, variantProps } from '../../../App/animations'
import { NewPurchase } from '../../../App/types'
import { cn } from '../../../App/utils'
import { useStore } from '../../../stores/useStore'
import { FormCheckboxGroup } from '../../formComponents/FormCheckboxGroup'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { FormInput } from '../../formComponents/FormInput'
import { FormRadioGroup } from '../../formComponents/FormRadioGroup'
import { FormTextarea } from '../../formComponents/FormTextarea'
import { ConvertButton } from './ConvertButton'

type PurchaseSegmentProps = {
  control: Control<NewPurchase>
  setShowConvertModal: Dispatch<SetStateAction<PurchaseFormPropertyName | ''>>
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
        <IonLabel className='text-xs'>Einkäufer*</IonLabel>
        <FormRadioGroup name='purchaserId' control={control} selectOptions={members} />
      </div>
      <div
        className={cn('flex flex-col border-b border-[#898989] bg-[#1e1e1e] px-4 py-2', {
          'border-[#eb445a]': errors.beneficiaryIds,
        })}
      >
        <IonLabel className='text-xs' color={cn({ danger: errors.beneficiaryIds })}>
          Begünstigte*
        </IonLabel>
        <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
      </div>
      <FormTextarea label='Beschreibung' name='description' control={control} />
    </motion.div>
  )
}
