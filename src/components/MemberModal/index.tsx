import { zodResolver } from '@hookform/resolvers/zod'
import { IonContent, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { isEmpty, isNotEmpty, pick } from 'ramda'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { NewMember } from '../../App/types'
import { findItem } from '../../App/utils'
import { MemberSliceResult } from '../../stores/slices/createMemberSlice'
import { Member } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { FormInput } from '../formComponents/FormInput'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { Show } from '../SolidComponents/Show'

type MemberModalProps = {
  onDismiss: () => void
  selectedMember?: Member
}

const validationSchema = z.object({
  name: z.string().trim().min(1),
  payPalMe: z.string().trim(),
})

const defaultValues = (selectedMember?: Member): NewMember => {
  if (!selectedMember) {
    return {
      name: '',
      payPalMe: '',
    }
  }
  return pick(['name', 'payPalMe'], selectedMember)
}

export const MemberModal = ({ onDismiss, selectedMember }: MemberModalProps): JSX.Element => {
  const { id: groupId } = useStore(s => s.selectedGroup)
  const addMember = usePersistedStore(s => s.addMember)
  const editMember = usePersistedStore(s => s.editMember)
  const contacts = usePersistedStore(s => s.contacts)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const { handleSubmit, setValue, control, setError, formState } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(selectedMember),
  })
  const [currentContactId, setCurrentContactId] = useState('')

  const resetCurrentContactId = () => isNotEmpty(currentContactId) && setCurrentContactId('')

  const onSubmit = handleSubmit(newMember => {
    let result: MemberSliceResult
    if (selectedMember) {
      result = editMember(groupId, selectedMember.id, newMember)
    } else {
      result = addMember(groupId, newMember)
    }
    if (!result.success) {
      setError('name', { type: 'manual', message: 'Dieser Name wird bereits verwendet!' })
      return
    }
    setShowAnimation()
    onDismiss()
  })

  const onSelectContact = (contactId: string) => {
    setCurrentContactId(contactId)
    if (isEmpty(contactId)) {
      setValue('name', '')
      setValue('payPalMe', '')
      return
    }
    const foundContact = findItem(contactId, contacts)
    if (foundContact) {
      setValue('name', foundContact.name, { shouldValidate: true })
      setValue('payPalMe', foundContact.payPalMe, { shouldValidate: true })
    }
  }

  return (
    <form className='flex flex-1 flex-col' onSubmit={onSubmit}>
      <ModalHeader title={selectedMember ? 'Mitglied bearbeiten' : 'Neues Mitglied'} onDismiss={onDismiss} />
      <IonContent>
        <div className='my-2 flex flex-col gap-2'>
          <IonSelect
            fill='solid'
            labelPlacement='floating'
            label='Aus Kontakten wählen'
            interface='popover'
            value={currentContactId}
            onIonChange={event => onSelectContact(event.target.value)}
          >
            <IonSelectOption value=''>-- Keine Auswahl --</IonSelectOption>
            {contacts.map(contact => (
              <IonSelectOption key={contact.id} value={contact.id}>
                {contact.name}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonText className='flex p-4 text-sm'>Oder manuell eingeben/anpassen:</IonText>
          <div className='flex flex-col gap-2'>
            <FormInput label='Name*' name='name' control={control} onKeyDown={resetCurrentContactId} />
            <Show when={formState.errors.name}>
              {value => (
                <IonText className='mx-4' color='danger'>
                  {value.message}
                </IonText>
              )}
            </Show>
            <FormInput label='PayPal.Me' name='payPalMe' control={control} onKeyDown={resetCurrentContactId} />
          </div>
        </div>
      </IonContent>
      <ModalFooter>Mitglied speichern</ModalFooter>
    </form>
  )
}
