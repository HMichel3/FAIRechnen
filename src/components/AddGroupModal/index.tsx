import { IonItemDivider, IonLabel } from '@ionic/react'
import { PageContent } from '../PageLayout/PageContent'
import { PageFooter } from '../PageLayout/PageFooter'
import { PageHeader } from '../PageLayout/PageHeader'
import { TextInput } from '../formComponents/TextInput'
import { mapIndexed } from 'ramda-adjunct'
import { ButtonWithSaveIcon } from '../ButtonWithSaveIcon'
import { useAddGroupModal } from './useAddGroupModal'
import { equalsLast } from '../../App/utils'

export interface AddGroupModalProps {
  onDismiss: () => void
}

export const AddGroupModal = ({ onDismiss }: AddGroupModalProps): JSX.Element => {
  const { pageContentRef, firstInputRef, firstInputRest, groupNameRef, formState, fields, register, remove, onSubmit } =
    useAddGroupModal(onDismiss)

  return (
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <PageHeader title='Neue Gruppe' onCloseButton={onDismiss} />
      <PageContent ref={pageContentRef}>
        <IonItemDivider color='medium'>
          <IonLabel>Gruppe</IonLabel>
        </IonItemDivider>
        <TextInput
          label='Gruppenname'
          placeholder='Name eingeben'
          error={formState.errors.groupName}
          ref={event => {
            firstInputRef(event)
            groupNameRef.current = event
          }}
          {...firstInputRest}
        />
        <IonItemDivider color='medium'>
          <IonLabel>Mitglieder</IonLabel>
        </IonItemDivider>
        {mapIndexed(
          (field, index) => (
            <TextInput
              key={field.id}
              label='Mitglied'
              placeholder='Name eingeben'
              {...register(`almostMembers.${index}.name`)}
              {...(!equalsLast(field, fields) && { onDelete: () => remove(index) })}
            />
          ),
          fields
        )}
      </PageContent>
      <PageFooter>
        <ButtonWithSaveIcon type='submit'>Gruppe speichern</ButtonWithSaveIcon>
      </PageFooter>
    </form>
  )
}
