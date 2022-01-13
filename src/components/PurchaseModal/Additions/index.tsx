import { IonAlert, IonButton, IonButtons, IonIcon, IonItemDivider, IonLabel } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { mapIndexed } from 'ramda-adjunct'
import { RefObject } from 'react'
import { Control } from 'react-hook-form'
import { FormValues } from '../usePurchaseModal'
import { Member } from '../../../App/types'
import { AdditionCard } from './AdditionCard'
import { useAdditions } from './useAdditions'
import { displayCurrencyValue } from '../../../App/utils'

export interface AdditionsProps {
  control: Control<FormValues>
  groupMembers: Member[]
  pageContentRef: RefObject<HTMLIonContentElement>
}

export const Additions = ({ control, groupMembers, pageContentRef }: AdditionsProps): JSX.Element => {
  const {
    fields,
    additions,
    additionsTotalAmount,
    showDeleteAdditionAlert,
    setShowDeleteAdditionAlert,
    setDeleteAdditionIndex,
    onAddAddition,
    onDeleteAddition,
  } = useAdditions({ control, pageContentRef })

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
      {mapIndexed(
        (field, index) =>
          additions[index] && (
            <AdditionCard
              key={field.id}
              addition={additions[index]}
              {...{
                index,
                control,
                groupMembers,
                setShowDeleteAdditionAlert,
                setDeleteAdditionIndex,
                pageContentRef,
              }}
            />
          ),
        fields
      )}
      <IonAlert
        cssClass='delete-alert'
        isOpen={showDeleteAdditionAlert}
        onDidDismiss={() => setShowDeleteAdditionAlert(false)}
        header='Wollen Sie den Zusatz wirklich löschen?'
        buttons={[
          { role: 'cancel', text: 'Abbrechen' },
          { text: 'Löschen', handler: onDeleteAddition },
        ]}
      />
    </>
  )
}
