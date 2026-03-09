import { personCircleSharp } from 'ionicons/icons'
import { isEmpty } from 'remeda'
import { useOverlay } from '../../hooks/useOverlay'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { Member } from '../../types/store'
import { sortByName } from '../../utils/common'
import { isLast, isNotEmptyString } from '../../utils/guard'
import { DeleteAlert } from '../alerts/DeleteAlert'
import { ContactInfo } from '../info/ContactInfo'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

export const ContactPageList = () => {
  const contacts = usePersistedStore(s => s.contacts)
  const deleteContact = usePersistedStore(s => s.deleteContact)
  const deleteContactOverlay = useOverlay<Member>()

  const sortedContacts = sortByName(contacts)

  if (isEmpty(sortedContacts)) {
    return <FullscreenText>Füge neue Kontakte hinzu!</FullscreenText>
  }

  return (
    <>
      <div className='pb-20'>
        {sortedContacts.map((contact, index) => (
          <SlidingListItem
            key={contact.id}
            icon={personCircleSharp}
            label={<ContactInfo contact={contact} />}
            routerLink={`/contacts/add/${contact.id}`}
            onDelete={() => deleteContactOverlay.onSelect(contact)}
            isActive={isNotEmptyString(contact.payPalMe)}
            lines={isLast(index, sortedContacts) ? 'none' : 'inset'}
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
