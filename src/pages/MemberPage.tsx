import { zodResolver } from '@hookform/resolvers/zod'
import { IonContent, IonPage, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { RouteComponentProps } from 'react-router'
import { pick } from 'remeda'
import { z } from 'zod'
import { FormInput } from '../components/ui/formComponents/FormInput'
import { PageFooter } from '../components/ui/PageFooter'
import { PageHeader } from '../components/ui/PageHeader'
import { useDismiss } from '../hooks/useDissmiss'
import { useGroupData } from '../hooks/useGroupData'
import { MemberSliceResult } from '../stores/slices/createMemberSlice'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { NewMember } from '../types/common'
import { Member } from '../types/store'
import { findItem } from '../utils/common'
import { isEmptyString, isNotEmptyString } from '../utils/guard'

type MemberPageProps = RouteComponentProps<{
  id: string
  memberId?: string
}>

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
  return pick(selectedMember, ['name', 'payPalMe'])
}

export const MemberPage = ({
  match: {
    params: { memberId },
  },
}: MemberPageProps) => {
  const groupData = useGroupData()
  const addMember = usePersistedStore(s => s.addMember)
  const editMember = usePersistedStore(s => s.editMember)
  const contacts = usePersistedStore(s => s.contacts)
  const showAnimation = useStore(s => s.showAnimation)
  const selectedMember = findItem(memberId, groupData.members)
  const { handleSubmit, setValue, control, setError, formState } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(selectedMember),
  })
  const [currentContactId, setCurrentContactId] = useState('')
  const onDismiss = useDismiss(`/groups/${groupData.id}`)

  const resetCurrentContactId = () => {
    if (isNotEmptyString(currentContactId)) {
      setCurrentContactId('')
    }
  }

  const onSubmit = handleSubmit(newMember => {
    let result: MemberSliceResult
    if (selectedMember) {
      result = editMember(groupData.id, selectedMember.id, newMember)
    } else {
      result = addMember(groupData.id, newMember)
    }
    if (!result.success) {
      setError('name', { type: 'manual', message: 'Der Name wird bereits verwendet!' })
      return
    }
    showAnimation()
    onDismiss()
  })

  const onSelectContact = (contactId: string) => {
    setCurrentContactId(contactId)
    if (isEmptyString(contactId)) {
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
    <IonPage>
      <PageHeader title={selectedMember ? 'Mitglied bearbeiten' : 'Neues Mitglied'} onDismiss={onDismiss} />
      <IonContent>
        <form id='member-form' onSubmit={onSubmit}>
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
              <FormInput label='PayPal.Me' name='payPalMe' control={control} onKeyDown={resetCurrentContactId} />
              {formState.errors.name?.type === 'manual' && (
                <IonText className='mx-4' color='danger'>
                  {formState.errors.name.message}
                </IonText>
              )}
            </div>
          </div>
        </form>
      </IonContent>
      <PageFooter form='member-form'>Mitglied speichern</PageFooter>
    </IonPage>
  )
}
