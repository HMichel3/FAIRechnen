import { IonButton, IonIcon, IonLabel } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { Dispatch, RefObject, SetStateAction } from 'react'
import { Control, useFieldArray, useFormState } from 'react-hook-form'
import { PurchaseFormPropertyName } from '..'
import { fadeOutLeftVariants, variantProps } from '../../../App/animations'
import { NewPurchase } from '../../../App/types'
import { SelectedGroup } from '../../../stores/types'
import { AdditionCard } from './AdditionCard'

interface AdditionSegmentProps {
  pageContentRef: RefObject<HTMLIonContentElement>
  control: Control<NewPurchase>
  members: SelectedGroup['members']
  setShowConvertModal: Dispatch<SetStateAction<PurchaseFormPropertyName | ''>>
}

export const AdditionSegment = ({
  pageContentRef,
  control,
  members,
  setShowConvertModal,
}: AdditionSegmentProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({ control, name: 'additions' })
  const { errors } = useFormState({ control })

  const onAddAddition = () => {
    append({ name: '', amount: 0, payerIds: [] })
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  return (
    <motion.div variants={fadeOutLeftVariants} {...variantProps}>
      <div className='mx-[10px] mt-[10px] flex items-center justify-between gap-2'>
        <div className='flex flex-col'>
          <IonLabel className='text-sm'>Artikel, welche nur für einzelne Mitglieder sind</IonLabel>
          <IonLabel className='text-xs'>(werden vor der Verrechnung des Einkaufs abgezogen)</IonLabel>
        </div>
        <IonButton onClick={onAddAddition}>
          <IonIcon slot='icon-only' icon={addSharp} />
        </IonButton>
      </div>
      <div>
        {fields.map((field, index) => {
          return (
            <AdditionCard
              key={field.id}
              index={index}
              control={control}
              members={members}
              additionErrors={errors.additions}
              setShowConvertModal={setShowConvertModal}
              remove={remove}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
