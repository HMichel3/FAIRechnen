import { IonAlert, IonButton, IonButtons, IonIcon, IonItemDivider, IonLabel } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { RefObject, useState } from 'react'
import { AdditionCard } from './AdditionCard'
import { isNil, pick } from 'ramda'
import { Control, useFieldArray, useFormState } from 'react-hook-form'
import { NewAddition, NewPurchase } from '../../../App/types'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../../App/animations'
import { SelectedGroup, Theme } from '../../../stores/types'
import './index.scss'

interface AdditionSegmentProps {
  pageContentRef: RefObject<HTMLIonContentElement>
  control: Control<NewPurchase>
  members: SelectedGroup['members']
  theme: Theme
}

export const AdditionSegment = ({ pageContentRef, control, members, theme }: AdditionSegmentProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({ control, name: 'additions' })
  const { errors } = useFormState({ control })
  const [additionIndex, setAdditionIndex] = useState<number | null>(null)

  const onAddAddition = () => {
    append({ name: '', amount: 0, payerIds: [] })
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  return (
    <>
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
          {fields.map((field, index) => {
            const addition: NewAddition = pick(['name', 'amount', 'payerIds'], field)
            return (
              <AdditionCard
                key={field.id}
                index={index}
                addition={addition}
                setAdditionIndex={setAdditionIndex}
                control={control}
                members={members}
                theme={theme}
                additionErrors={errors.additions}
              />
            )
          })}
        </div>
      </motion.div>
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
    </>
  )
}
