import { IonContent, IonItemDivider, IonLabel } from '@ionic/react'
import { useAddGroupModal } from './useAddGroupModal'
import { isLast } from '../../App/utils'
import { FormComponent } from '../formComponents/FormComponent'
import { FormInput } from '../formComponents/FormInput'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { FormProvider } from 'react-hook-form'
import { GroupTemplate } from './GroupTemplate'
import clsx from 'clsx'

export interface AddGroupModalProps {
  onDismiss: () => void
}

export const AddGroupModal = ({ onDismiss }: AddGroupModalProps): JSX.Element => {
  const { pageContentRef, fields, remove, onSubmit, replace, methods } = useAddGroupModal(onDismiss)

  return (
    <FormProvider {...methods}>
      <form className='flex-column-full-height' onSubmit={onSubmit}>
        <ModalHeader title='Neue Gruppe' onDismiss={onDismiss} />
        <IonContent ref={pageContentRef}>
          <IonItemDivider color='medium'>
            <IonLabel>Gruppenvorlage</IonLabel>
          </IonItemDivider>
          <GroupTemplate replace={replace} />
          <IonItemDivider color='medium'>
            <IonLabel>Gruppe</IonLabel>
          </IonItemDivider>
          <FormComponent label='Gruppenname' error={methods.formState.errors.groupName}>
            <FormInput name='groupName' control={methods.control} />
          </FormComponent>
          {fields.map((field, index) => {
            const isNotLastField = !isLast(field, fields)
            return (
              <FormComponent
                key={field.id}
                label='Mitglied'
                className={clsx(isNotLastField ? 'default-margin-small ' : 'default-margin-small-top')}
                {...(isNotLastField && { onDelete: () => remove(index) })}
              >
                <FormInput name={`memberNames.${index}.name`} control={methods.control} />
              </FormComponent>
            )
          })}
        </IonContent>
        <ModalFooter>Gruppe speichern</ModalFooter>
      </form>
    </FormProvider>
  )
}
