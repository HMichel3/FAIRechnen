import { zodResolver } from '@hookform/resolvers/zod'
import { IonContent, IonList, IonPage, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { closeCircleOutline } from 'ionicons/icons'
import { useEffect, useMemo, useRef } from 'react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { filter, forEach, hasAtLeast, isEmpty, last, map, pick, pipe } from 'remeda'
import { z } from 'zod'
import { FormInput } from '../components/ui/formComponents/FormInput'
import { IconButton } from '../components/ui/IconButton'
import { PageFooter } from '../components/ui/PageFooter'
import { PageHeader } from '../components/ui/PageHeader'
import { useDismiss } from '../hooks/useDissmiss'
import { useSortedContacts } from '../hooks/useSortedContacts'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { cn, createKeyFromProperties, filterNonEmptyNames, normalizeString } from '../utils/common'
import { isLast, isNotEmptyString } from '../utils/guard'

const validationSchema = z.object({
  groupName: z.string().trim().min(1),
  members: z
    .object({
      name: z.string().trim(),
      payPalMe: z.string().trim(),
    })
    .array()
    .superRefine((members, ctx) => {
      const seenNames = new Set<string>()
      members.forEach((member, index) => {
        const normalizedName = normalizeString(member.name)
        if (isEmpty(normalizedName)) return
        if (seenNames.has(normalizedName)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Name existiert bereits',
            path: [index, 'name'],
          })
        } else {
          seenNames.add(normalizedName)
        }
      })
    }),
})

type GroupFormValues = z.infer<typeof validationSchema>

const defaultValues: GroupFormValues = {
  groupName: '',
  members: [{ name: '', payPalMe: '' }],
}

export const AddGroupPage = () => {
  const contacts = useSortedContacts()
  const addGroup = usePersistedStore(s => s.addGroup)
  const showAnimation = useStore(s => s.showAnimation)
  const methods = useForm({ resolver: zodResolver(validationSchema), defaultValues })
  const { fields, append, remove, replace } = useFieldArray({ control: methods.control, name: 'members' })
  const watchedMembers = useWatch({ control: methods.control, name: 'members' })
  const onDismiss = useDismiss('/tabs/groups')
  const contentRef = useRef<HTMLIonContentElement>(null)

  const selectedContactIds = useMemo(() => {
    const memberKeys = new Set(map(watchedMembers, createKeyFromProperties))
    return pipe(
      contacts,
      filter(contact => memberKeys.has(createKeyFromProperties(pick(contact, ['name', 'payPalMe'])))),
      map(contact => contact.id)
    )
  }, [watchedMembers, contacts])

  useEffect(() => {
    if (isNotEmptyString(last(watchedMembers)?.name)) {
      append({ name: '', payPalMe: '' })
      setTimeout(() => {
        contentRef.current?.scrollToBottom(300)
      }, 100)
    }
  }, [watchedMembers, append])

  const onSelectContacts = (contactIds: string[]) => {
    const selectedIds = new Set(contactIds)
    const allContactKeys = new Map(
      contacts.map(contact => [createKeyFromProperties(pick(contact, ['name', 'payPalMe'])), contact.id])
    )
    const newMembers: { name: string; payPalMe: string }[] = []
    const newContactIdsToAdd = new Set(contactIds)
    forEach(watchedMembers, member => {
      if (isEmpty(normalizeString(member.name))) return
      const memberKey = createKeyFromProperties(pick(member, ['name', 'payPalMe']))
      const contactId = allContactKeys.get(memberKey)
      if (contactId) {
        if (selectedIds.has(contactId)) {
          newMembers.push(member)
          newContactIdsToAdd.delete(contactId)
        }
      } else {
        newMembers.push(member)
      }
    })
    const newlySelectedContacts = pipe(
      contacts,
      filter(contact => newContactIdsToAdd.has(contact.id)),
      map(pick(['name', 'payPalMe']))
    )
    newMembers.push(...newlySelectedContacts, { name: '', payPalMe: '' })
    replace(newMembers)
  }

  const onSubmit = methods.handleSubmit(({ groupName, members }) => {
    addGroup(groupName, members)
    showAnimation()
    onDismiss()
  })

  return (
    <FormProvider {...methods}>
      <IonPage>
        <PageHeader title='Neue Gruppe' onDismiss={onDismiss} />
        <IonContent ref={contentRef}>
          <form id='group-form' onSubmit={onSubmit}>
            <div className='my-2 flex flex-col gap-2'>
              <FormInput label='Gruppenname*' name='groupName' control={methods.control} />
              <IonText className='flex p-4 text-sm'>Mitglieder ({filterNonEmptyNames(watchedMembers).length})</IonText>
              {hasAtLeast(contacts, 1) && (
                <IonSelect
                  fill='solid'
                  labelPlacement='floating'
                  label='Aus Kontakten wählen'
                  multiple={true}
                  interface='modal'
                  value={selectedContactIds}
                  onIonChange={event => onSelectContacts(event.detail.value)}
                  className='w-full'
                  cancelText='Auswahl übernehmen'
                >
                  {contacts.map(contact => (
                    <IonSelectOption key={contact.id} value={contact.id}>
                      {contact.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              )}
              <IonList className='bg-transparent p-0'>
                {fields.map((field, index) => {
                  const hasName = isNotEmptyString(watchedMembers[index]?.name)
                  return (
                    <div key={field.id} className={cn({ 'bg-[#1e1e1e]/50': hasName })}>
                      <div className='flex p-2 pr-0'>
                        <div className='flex gap-2'>
                          <FormInput label='Name' name={`members.${index}.name`} control={methods.control} />
                          <FormInput label='PayPal.Me' name={`members.${index}.payPalMe`} control={methods.control} />
                        </div>
                        <IconButton
                          color='danger'
                          icon={closeCircleOutline}
                          onClick={() => remove(index)}
                          disabled={isLast(index, fields)}
                        />
                      </div>
                    </div>
                  )
                })}
              </IonList>
            </div>
          </form>
        </IonContent>
        <PageFooter form='group-form'>Gruppe speichern</PageFooter>
      </IonPage>
    </FormProvider>
  )
}
