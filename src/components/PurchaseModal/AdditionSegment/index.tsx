import { IonAlert, IonButton, IonButtons, IonIcon, IonItemDivider, IonLabel } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { RefObject, useState } from 'react'
import { AdditionCard } from './AdditionCard'
import { isNil } from 'ramda'
import { Control, useFieldArray } from 'react-hook-form'
import { NewPurchase } from '../../../App/types'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../../App/animations'
import './index.scss'

export interface AdditionSegmentProps {
  pageContentRef: RefObject<HTMLIonContentElement>
  control: Control<NewPurchase>
}

export const AdditionSegment = ({ pageContentRef, control }: AdditionSegmentProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({ control, name: 'additions' })
  // the additionIndex is needed for the delete-alert (can't move it into the additionCard, because of memory leak)
  const [additionIndex, setAdditionIndex] = useState<number | null>(null)

  const onAddAddition = () => {
    append({ name: '', amount: 0, payerIds: [] })
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  return (
    <motion.div variants={fadeOutLeftVariants} {...variantProps}>
      <IonItemDivider color='medium' className='fixed-divider'>
        <div>
          <div>
            <IonLabel>Artikel, welche nur für einzelne Mitglieder sind</IonLabel>
          </div>
          <div className='smaller-label-component'>
            <IonLabel>Werden vor der Verrechnung des Einkaufs abgezogen</IonLabel>
          </div>
        </div>
        <IonButtons style={{ marginRight: 1, marginLeft: 0 }} slot='end'>
          <IonButton onClick={onAddAddition}>
            <IonIcon slot='icon-only' icon={addSharp} />
          </IonButton>
        </IonButtons>
      </IonItemDivider>
      <div className='addition-cards'>
        {fields.map((field, index) => (
          <AdditionCard key={field.id} index={index} setAdditionIndex={setAdditionIndex} control={control} />
        ))}
      </div>
      <IonAlert
        cssClass='delete-alert'
        isOpen={!isNil(additionIndex)}
        onDidDismiss={() => setAdditionIndex(null)}
        header='Wollen Sie den Zusatz wirklich löschen?'
        buttons={[
          { role: 'cancel', text: 'Abbrechen' },
          { text: 'Löschen', handler: () => remove(additionIndex!) },
        ]}
      />
    </motion.div>
  )
}