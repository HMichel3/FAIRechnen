import { IonLabel } from '@ionic/react'
import { calculatorSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { Control, useFormState } from 'react-hook-form'
import { PurchaseFormPropertyName } from '../../pages/PurchasePage'
import { NewPurchase } from '../../types/common'
import { Member } from '../../types/store'
import { fadeOutRightVariants } from '../../utils/animation'
import { cn } from '../../utils/common'
import { FormCheckboxGroup } from '../ui/formComponents/FormCheckboxGroup'
import { FormCurrency } from '../ui/formComponents/FormCurrency'
import { FormInput } from '../ui/formComponents/FormInput'
import { FormRadioGroup } from '../ui/formComponents/FormRadioGroup'
import { FormTextarea } from '../ui/formComponents/FormTextarea'
import { IconButton } from '../ui/IconButton'

type PurchaseSegmentProps = {
  control: Control<NewPurchase>
  members: Member[]
  setShowConvertModal: (value: PurchaseFormPropertyName) => void
}

export const PurchaseSegment = ({ control, members, setShowConvertModal }: PurchaseSegmentProps) => {
  const { errors } = useFormState({ control })

  return (
    <motion.div className='my-2 flex flex-col gap-2' {...fadeOutRightVariants}>
      <FormInput label='Einkaufname*' name='name' control={control} />
      <div className='flex'>
        <FormCurrency label='Betrag*' name='amount' control={control} />
        <IconButton icon={calculatorSharp} size='large' onClick={() => setShowConvertModal('amount')} />
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
