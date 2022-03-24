import { IonAlert, IonButton, IonButtons, IonIcon, IonItemDivider, IonLabel } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { RefObject, useState } from 'react'
import { AdditionCard } from './AdditionCard'
import { displayCurrencyValue, getTotalAmountFromArray } from '../../../App/utils'
import { isNil } from 'ramda'
import { Control, useFieldArray, useWatch } from 'react-hook-form'
import { NewPurchase } from '../../../App/types'
import './index.scss'

export interface AdditionComponentProps {
  pageContentRef: RefObject<HTMLIonContentElement>
  control: Control<NewPurchase>
}

export const AdditionComponent = ({ pageContentRef, control }: AdditionComponentProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({ control, name: 'additions' })
  const additions = useWatch({ control, name: 'additions' })
  // the additionIndex is needed for the delete-alert (can't move it into the additionCard, because of memory leak)
  const [additionIndex, setAdditionIndex] = useState<number | null>(null)

  const onAddAddition = () => {
    append({ name: '', amount: 0, payerIds: [] })
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  return (
    <div className='addition-component'>
      <IonItemDivider color='medium'>
        <div>
          <div>
            <IonLabel>Zusätze ({displayCurrencyValue(getTotalAmountFromArray(additions))})</IonLabel>
          </div>
          <div className='smaller-label-component'>
            <IonLabel>Artikel, die nur für einzelne Mitglieder gekauft werden</IonLabel>
          </div>
        </div>
        <IonButtons style={{ marginRight: 1, marginLeft: 0 }} slot='end'>
          <IonButton onClick={onAddAddition}>
            <IonIcon slot='icon-only' icon={addSharp} />
          </IonButton>
        </IonButtons>
      </IonItemDivider>
      {fields.map((field, index) => (
        <AdditionCard key={field.id} {...{ index, pageContentRef, setAdditionIndex, control }} />
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
    </div>
  )
}
