import { IonAlert, IonButton, IonButtons, IonIcon, IonItemDivider, IonLabel } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { RefObject, useState } from 'react'
import { AdditionCard } from './AdditionCard'
import { displayCurrencyValue, getTotalAmountFromArray } from '../../../App/utils'
import { isNil } from 'ramda'
import { useFieldArray, useFormContext } from 'react-hook-form'

export interface AdditionsProps {
  pageContentRef: RefObject<HTMLIonContentElement>
}

export const Additions = ({ pageContentRef }: AdditionsProps): JSX.Element => {
  const { control, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: 'additions' })
  // the additionIndex is needed for the delete-alert (can't move it into the additionCard, because of memory leak)
  const [additionIndex, setAdditionIndex] = useState<number | null>(null)
  const additionsTotalAmount = getTotalAmountFromArray(watch('additions'))

  const onAddAddition = () => {
    append({ name: '', amount: 0, payerIds: [] })
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  return (
    <>
      <IonItemDivider color='medium'>
        <IonLabel>Zusätze ({displayCurrencyValue(additionsTotalAmount)})</IonLabel>
        <IonButtons style={{ marginRight: 1 }} slot='end'>
          <IonButton onClick={onAddAddition}>
            <IonIcon slot='icon-only' icon={addSharp} />
          </IonButton>
        </IonButtons>
      </IonItemDivider>
      {fields.map((field, index) => (
        <AdditionCard key={field.id} {...{ index, pageContentRef, setAdditionIndex }} />
      ))}
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
