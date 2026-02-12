import { IonText, IonToast, useIonAlert } from '@ionic/react'
import { personCircleSharp } from 'ionicons/icons'
import { isNotEmpty, trim } from 'ramda'
import { useState } from 'react'
import { isLast, isNotEmptyString, sortByName } from '../../App/utils'
import { Member } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { SlidingListItem } from '../SlidingListItem'
import { Show } from '../SolidComponents/Show'

export const ContactPageList = (): JSX.Element => {
  const contacts = usePersistedStore(s => s.contacts)
  const editContact = usePersistedStore(s => s.editContact)
  const deleteContact = usePersistedStore(s => s.deleteContact)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const [presentDeleteContact] = useIonAlert()
  const [presentEditMember] = useIonAlert()
  const [isToastOpen, setIsToastOpen] = useState(false)

  const sortedContacts = sortByName(contacts)

  const onSelectContact = (contact: Member) => {
    presentEditMember({
      header: 'Kontakt bearbeiten',
      inputs: [
        { name: 'contactName', value: contact.name },
        { name: 'payPalMe', value: contact.payPalMe, placeholder: 'PayPal.Me eingeben' },
      ],
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        {
          role: 'confirm',
          text: 'Speichern',
          handler: ({ contactName, payPalMe }) => {
            const newContact = { name: trim(contactName), payPalMe: trim(payPalMe) }
            const result = editContact(contact.id, newContact)
            if (!result.success) {
              setIsToastOpen(true)
              return false
            }
            setShowAnimation()
          },
        },
      ],
    })
  }

  const onDeleteContact = (contactId: string) => {
    presentDeleteContact({
      header: 'Wollen Sie diesen Kontakt wirklich löschen?',
      message:
        'Mit dem Löschen des Kontakts wird der Eintrag aus den Kontakten entfernt. Mitglieder einer Gruppe, welche über den Kontakt hinzugefügt wurden, bleiben erhalten!',
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        { role: 'confirm', text: 'Löschen', handler: () => deleteContact(contactId) },
      ],
    })
  }

  return (
    <>
      <Show
        when={isNotEmpty(sortedContacts)}
        fallback={
          <IonText className='grid h-full place-items-center text-lg text-neutral-400'>
            Füge neue Kontakte hinzu!
          </IonText>
        }
      >
        {sortedContacts.map((contact, index) => (
          <SlidingListItem
            key={contact.id}
            label={contact.name}
            onDelete={() => onDeleteContact(contact.id)}
            onSelect={() => onSelectContact(contact)}
            icon={personCircleSharp}
            labelComponent={
              <div className='flex h-5'>
                <Show
                  when={isNotEmptyString(contact.payPalMe)}
                  fallback={<IonText className='text-sm italic text-neutral-400'>PayPal.Me hinterlegen</IonText>}
                >
                  <IonText className='text-sm text-neutral-400'>@{contact.payPalMe}</IonText>
                </Show>
              </div>
            }
            lines={isLast(index, sortedContacts) ? 'none' : 'inset'}
            detail
            activeIcon={isNotEmptyString(contact.payPalMe)}
          />
        ))}
      </Show>
      <IonToast
        isOpen={isToastOpen}
        message='Dieser Kontakt existiert bereits!'
        onDidDismiss={() => setIsToastOpen(false)}
        duration={5000}
        color='danger'
      />
    </>
  )
}
