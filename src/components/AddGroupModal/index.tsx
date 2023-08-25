import { IonButton, IonContent, IonIcon } from '@ionic/react'
import { FormInput } from '../formComponents/FormInput'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { useEffect } from 'react'
import { isEmpty, last } from 'ramda'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isLast } from '../../App/utils'
import { closeSharp } from 'ionicons/icons'

interface AddGroupModalProps {
  onDismiss: () => void
}

const validationSchema = z.object({
  groupName: z.string().trim().min(1),
  memberNames: z.object({ name: z.string() }).array(),
})

interface GroupFormValues {
  groupName: string
  memberNames: { name: string }[]
}

const defaultValues: GroupFormValues = { groupName: '', memberNames: [{ name: '' }] }

export const AddGroupModal = ({ onDismiss }: AddGroupModalProps): JSX.Element => {
  const addGroup = usePersistedStore(s => s.addGroup)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const methods = useForm({ resolver: zodResolver(validationSchema), defaultValues })
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'memberNames' })
  const memberNamesFields = useWatch({ control: methods.control, name: 'memberNames' })

  useEffect(() => {
    if (!isEmpty(last(memberNamesFields)?.name)) {
      append({ name: '' })
    }
  }, [memberNamesFields, append])

  const onSubmit = methods.handleSubmit(({ groupName, memberNames }) => {
    addGroup(groupName, memberNames)
    setShowAnimation()
    onDismiss()
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className='flex flex-col flex-1'>
        <ModalHeader title='Neue Gruppe' onDismiss={onDismiss} />
        <IonContent>
          <FormInput label='Gruppenname*' name='groupName' control={methods.control} />
          {fields.map((field, index) => (
            <div key={field.id} className='flex'>
              <FormInput label='Mitglied' name={`memberNames.${index}.name`} control={methods.control} />
              {!isLast(field, fields) && (
                <IonButton
                  className='m-0 h-14 w-14 bg-[#1e1e1e] border-b-[0.666667px] border-[#898989]'
                  color='danger'
                  slot='end'
                  fill='clear'
                  onClick={() => remove(index)}
                >
                  <IonIcon slot='icon-only' icon={closeSharp} />
                </IonButton>
              )}
            </div>
          ))}
        </IonContent>
        <ModalFooter>Gruppe speichern</ModalFooter>
      </form>
    </FormProvider>
  )
}
