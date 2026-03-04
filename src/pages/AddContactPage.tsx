import { zodResolver } from '@hookform/resolvers/zod'
import { IonContent, IonPage, IonText } from '@ionic/react'
import { useForm } from 'react-hook-form'
import { RouteComponentProps } from 'react-router'
import { isNullish, pick } from 'remeda'
import { z } from 'zod'
import { FormInput } from '../components/ui/formComponents/FormInput'
import { PageFooter } from '../components/ui/PageFooter'
import { PageHeader } from '../components/ui/PageHeader'
import { useDismiss } from '../hooks/useDissmiss'
import { ContactSliceResult } from '../stores/slices/createContactSlice'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { NewMember } from '../types/common'
import { Member } from '../types/store'
import { findItem } from '../utils/common'

type AddContactPageProps = RouteComponentProps<{
  contactId?: string
}>

const validationSchema = z.object({
  name: z.string().trim().min(1),
  payPalMe: z.string().trim(),
})

const defaultValues = (selected?: Member): NewMember => {
  if (isNullish(selected)) {
    return {
      name: '',
      payPalMe: '',
    }
  }
  return pick(selected, ['name', 'payPalMe'])
}

export const AddContactPage = ({
  match: {
    params: { contactId },
  },
}: AddContactPageProps) => {
  const contacts = usePersistedStore(s => s.contacts)
  const addContact = usePersistedStore(s => s.addContact)
  const editContact = usePersistedStore(s => s.editContact)
  const showAnimation = useStore(s => s.showAnimation)
  const selected = findItem(contactId, contacts)
  const { handleSubmit, control, setError, formState } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(selected),
  })
  const onDismiss = useDismiss('/tabs/contacts')

  const onSubmit = handleSubmit(newContact => {
    let result: ContactSliceResult
    if (selected) {
      result = editContact(selected.id, newContact)
    } else {
      result = addContact(newContact)
    }
    if (!result.success) {
      setError('name', { type: 'manual', message: 'Der Name wird bereits verwendet!' })
      return
    }
    showAnimation()
    onDismiss()
  })

  const title = selected ? 'Kontakt bearbeiten' : 'Neuer Kontakt'
  const submit = selected ? 'Speichern' : 'Hinzufügen'

  return (
    <IonPage>
      <PageHeader title={title} onDismiss={onDismiss} />
      <IonContent>
        <form id='contact-form' onSubmit={onSubmit}>
          <div className='my-2 flex flex-col gap-2'>
            <FormInput label='Name*' name='name' control={control} />
            <FormInput label='PayPal.Me' name='payPalMe' control={control} />
            {formState.errors.name?.type === 'manual' && (
              <IonText className='mx-4' color='danger'>
                {formState.errors.name.message}
              </IonText>
            )}
          </div>
        </form>
      </IonContent>
      <PageFooter form='contact-form'>{submit}</PageFooter>
    </IonPage>
  )
}
