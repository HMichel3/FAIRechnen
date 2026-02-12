import { zodResolver } from '@hookform/resolvers/zod'
import { IonButton, IonChip, IonContent, IonIcon, IonText } from '@ionic/react'
import { checkmarkCircleSharp, closeCircleSharp, personCircleSharp } from 'ionicons/icons'
import { isEmpty, isNotEmpty, last } from 'ramda'
import { useEffect } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn, filterNonEmptyNames, findItemIndexByName, isLast, isNameInArray, normalizeString } from '../../App/utils'
import { Member } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { FormInput } from '../formComponents/FormInput'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { Show } from '../SolidComponents/Show'

type AddGroupModalProps = {
  onDismiss: () => void
}

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

const defaultValues: GroupFormValues = { groupName: '', members: [{ name: '', payPalMe: '' }] }

export const AddGroupModal = ({ onDismiss }: AddGroupModalProps): JSX.Element => {
  const contacts = usePersistedStore(s => s.contacts)
  const addGroup = usePersistedStore(s => s.addGroup)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const methods = useForm({ resolver: zodResolver(validationSchema), defaultValues })
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'members' })
  const watchMembers = methods.watch('members')
  const memberFields = fields.map((field, index) => ({ ...field, ...watchMembers[index] }))

  useEffect(() => {
    if (isNotEmpty(last(memberFields)?.name)) {
      append({ name: '', payPalMe: '' })
    }
  }, [memberFields, append])

  const toggleContact = (contact: Member) => {
    const memberFieldIndex = findItemIndexByName(contact.name, memberFields)
    if (memberFieldIndex !== -1) {
      remove(memberFieldIndex)
      return
    }
    const newMemberField = { name: contact.name, payPalMe: contact.payPalMe }
    methods.setValue(`members.${memberFields.length - 1}`, newMemberField)
  }

  const onSubmit = methods.handleSubmit(({ groupName, members }) => {
    addGroup(groupName, members)
    setShowAnimation()
    onDismiss()
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className='flex flex-1 flex-col'>
        <ModalHeader title='Neue Gruppe' onDismiss={onDismiss} />
        <IonContent>
          <div className='my-2 flex flex-col gap-4'>
            <FormInput label='Gruppenname*' name='groupName' control={methods.control} />
            <Show when={isNotEmpty(contacts)}>
              <div className='flex flex-col gap-2 px-4'>
                <IonText>Aus Kontakten wählen</IonText>
                <div className='no-scrollbar flex gap-2 overflow-x-auto'>
                  {contacts.map(contact => {
                    const isActive = isNameInArray(contact.name, memberFields)
                    return (
                      <div
                        key={contact.id}
                        onClick={() => toggleContact(contact)}
                        className='flex w-16 flex-none flex-col items-center gap-2 text-neutral-400'
                      >
                        <IonIcon
                          icon={isActive ? checkmarkCircleSharp : personCircleSharp}
                          className='text-4xl'
                          color={cn({ primary: isActive })}
                        />
                        <IonText
                          className='line-clamp-2 text-center text-sm leading-tight'
                          color={cn({ primary: isActive })}
                        >
                          {contact.name}
                        </IonText>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Show>
            <div className='flex flex-col gap-2 px-4'>
              <div className='flex items-center justify-between'>
                <IonText>Gruppenmitglieder</IonText>
                <IonChip className='pointer-events-none m-0'>{filterNonEmptyNames(memberFields).length}</IonChip>
              </div>
              <div className='flex flex-col gap-2'>
                {memberFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={cn(
                      'flex flex-col rounded-2xl border border-neutral-400 p-4',
                      isNotEmpty(field.name) ? 'bg-zinc-900' : 'border-dashed bg-transparent opacity-60'
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex-1'>
                        <FormInput label='Name*' name={`members.${index}.name`} control={methods.control} />
                        <FormInput label='PayPal.Me' name={`members.${index}.payPalMe`} control={methods.control} />
                      </div>
                      <Show when={!isLast(index, memberFields)}>
                        <IonButton className='m-0' fill='clear' color='danger' onClick={() => remove(index)}>
                          <IonIcon slot='icon-only' icon={closeCircleSharp} />
                        </IonButton>
                      </Show>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </IonContent>
        <ModalFooter>Gruppe speichern</ModalFooter>
      </form>
    </FormProvider>
  )
}
