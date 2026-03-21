import { personCircleSharp } from 'ionicons/icons'
import { isEmpty } from 'remeda'
import { useOverlay } from '../../hooks/useOverlay'
import { useSortedContacts } from '../../hooks/useSortedContacts'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { Member } from '../../types/store'
import { isLast, isNotEmptyString } from '../../utils/guard'
import { DeleteAlert } from '../alerts/DeleteAlert'
import { ContactInfo } from '../info/ContactInfo'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

export const ContactPageList = () => {
  const contacts = useSortedContacts()
  const deleteContact = usePersistedStore(s => s.deleteContact)
  const deleteContactOverlay = useOverlay<Member>()

  if (isEmpty(contacts)) {
    return <FullscreenText>Füge neue Kontakte hinzu!</FullscreenText>
  }

  return (
    <>
      <div className='pb-20'>
        {contacts.map((contact, index) => (
          <SlidingListItem
            key={contact.id}
            icon={personCircleSharp}
            label={<ContactInfo contact={contact} />}
            routerLink={`/contacts/add/${contact.id}`}
            onDelete={() => deleteContactOverlay.onSelect(contact)}
            isActive={isNotEmptyString(contact.payPalMe)}
            lines={isLast(index, contacts) ? 'none' : 'inset'}
            detail
          />
        ))}
      </div>
      <DeleteAlert
        overlay={deleteContactOverlay}
        onDelete={deleteContact}
        message='Mitglieder, die du über diesen Kontakt hinzugefügt hast, bleiben in deinen Gruppen erhalten.'
      />
    </>
  )
}
