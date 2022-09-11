import { IonContent, IonItemDivider, IonLabel } from '@ionic/react'
import { isLast } from '../../App/utils'
import { FormComponent } from '../formComponents/FormComponent'
import { FormInput } from '../formComponents/FormInput'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import clsx from 'clsx'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { useEffect, useRef } from 'react'
import { isEmpty } from 'ramda'

interface AddGroupModalProps {
  onDismiss: () => void
}

interface GroupFormValues {
  groupName: string
  memberNames: { name: string }[]
}

const defaultValues: GroupFormValues = { groupName: '', memberNames: [{ name: '' }] }

export const AddGroupModal = ({ onDismiss }: AddGroupModalProps): JSX.Element => {
  const addGroup = usePersistedStore(s => s.addGroup)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const methods = useForm({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'memberNames' })
  const memberNamesFields = useWatch({ control: methods.control, name: 'memberNames' })
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    if (!isEmpty(memberNamesFields.at(-1)?.name)) {
      append({ name: '' })
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
      return
    }
    if (isEmpty(memberNamesFields.at(-2)?.name)) {
      remove(memberNamesFields.length - 1)
    }
  }, [memberNamesFields, append, remove])

  const onSubmit = methods.handleSubmit(({ groupName, memberNames }) => {
    addGroup(groupName, memberNames)
    setShowAnimation()
    onDismiss()
  })

  return (
    <FormProvider {...methods}>
      <form className='flex-column-full-height' onSubmit={onSubmit}>
        <ModalHeader title='Neue Gruppe' onDismiss={onDismiss} />
        <IonContent ref={pageContentRef}>
          <IonItemDivider color='medium'>
            <IonLabel>Gruppe</IonLabel>
          </IonItemDivider>
          <FormComponent label='Gruppenname' error={methods.formState.errors.groupName}>
            <FormInput name='groupName' control={methods.control} rules={{ required: true }} />
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
