import { IonContent, IonItemDivider, IonLabel } from '@ionic/react'
import { useAddGroupModal } from './useAddGroupModal'
import { isLast } from '../../App/utils'
import { FormComponent } from '../formComponents/FormComponent'
import { FormInput } from '../formComponents/FormInput'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { ModalFooter } from '../modalComponents/ModalFooter'

export interface AddGroupModalProps {
  onDismiss: () => void
}

export const AddGroupModal = ({ onDismiss }: AddGroupModalProps): JSX.Element => {
  const { pageContentRef, formState, fields, remove, onSubmit, control } = useAddGroupModal(onDismiss)

  return (
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <ModalHeader title='Neue Gruppe' onDismiss={onDismiss} />
      <IonContent ref={pageContentRef}>
        <IonItemDivider color='medium'>
          <IonLabel>Gruppe</IonLabel>
        </IonItemDivider>
        <FormComponent label='Gruppenname' error={formState.errors.groupName}>
          <FormInput name='groupName' control={control} />
        </FormComponent>
        <IonItemDivider color='medium'>
          <IonLabel>Mitglieder</IonLabel>
        </IonItemDivider>
        {fields.map((field, index) => (
          <FormComponent
            key={field.id}
            label='Mitglied'
            {...(!isLast(field, fields) && { onDelete: () => remove(index) })}
          >
            <FormInput name={`memberNames.${index}.name`} control={control} />
          </FormComponent>
        ))}
      </IonContent>
      <ModalFooter>Gruppe speichern</ModalFooter>
    </form>
  )
}
