import { isEmpty } from 'ramda'
import { NewMember } from '../../App/types'
import { findItemIndex, isNameInArray, rejectById } from '../../App/utils'
import { Member } from '../types'
import { PersistImmer } from '../usePersistedStore'
import { withMetaData } from '../utils'

type ContactSliceResult = { success: true } | { success: false; reason: 'contact_not_found' | 'duplicate_name' }

export type ContactSlice = {
  contacts: Member[]
  addContact: (newContact: NewMember) => ContactSliceResult
  editContact: (contactId: string, newContact: NewMember) => ContactSliceResult
  deleteContact: (contactId: string) => void
  addContacts: (uniqNewContacts: NewMember[]) => void
}

export const createContactSlice: PersistImmer<ContactSlice> = (set, get) => ({
  contacts: [],
  addContact: newContact => {
    const { contacts } = get()
    if (isNameInArray(newContact.name, contacts)) {
      return { success: false, reason: 'duplicate_name' }
    }
    set(store => {
      store.contacts.push(withMetaData(newContact))
    })
    return { success: true }
  },
  editContact: (contactId, newContact) => {
    const { contacts } = get()
    const contactIndex = findItemIndex(contactId, contacts)
    if (contactIndex === -1) {
      return { success: false, reason: 'contact_not_found' }
    }
    if (isNameInArray(newContact.name, contacts, contactId)) {
      return { success: false, reason: 'duplicate_name' }
    }
    set(store => {
      Object.assign(store.contacts[contactIndex], newContact)
    })
    return { success: true }
  },
  deleteContact: contactId =>
    set(store => {
      store.contacts = rejectById(contactId, store.contacts)
    }),
  addContacts: uniqNewContacts =>
    set(store => {
      const validNewContacts = uniqNewContacts
        .filter(({ name }) => !isNameInArray(name, store.contacts))
        .map(withMetaData)
      if (isEmpty(validNewContacts)) return
      store.contacts.push(...validNewContacts)
    }),
})
