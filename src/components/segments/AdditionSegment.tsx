import { IonLabel } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { RefObject } from 'react'
import { Control, useFieldArray, useFormState } from 'react-hook-form'
import { PurchaseFormPropertyName } from '../../pages/PurchasePage'
import { NewPurchase } from '../../types/common'
import { SelectedGroup } from '../../types/store'
import { fadeOutLeftVariants } from '../../utils/animation'
import { AdditionCard } from '../others/AdditionCard'
import { IconButton } from '../ui/IconButton'

type AdditionSegmentProps = {
  pageContentRef: RefObject<HTMLIonContentElement>
  control: Control<NewPurchase>
  members: SelectedGroup['members']
  setShowConvertModal: (value: PurchaseFormPropertyName) => void
}

export const AdditionSegment = ({ pageContentRef, control, members, setShowConvertModal }: AdditionSegmentProps) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'additions' })
  const { errors } = useFormState({ control })

  const onAddAddition = () => {
    append({ name: '', amount: 0, payerIds: [] })
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  return (
    <motion.div {...fadeOutLeftVariants}>
      <div className='mx-[10px] mt-[10px] flex items-center justify-between gap-2'>
        <div className='flex flex-col'>
          <IonLabel className='text-sm'>Artikel, welche nur für einzelne Mitglieder sind</IonLabel>
          <IonLabel className='text-xs'>(werden vor der Verrechnung des Einkaufs abgezogen)</IonLabel>
        </div>
        <IconButton icon={addSharp} onClick={onAddAddition} fill='solid' />
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
