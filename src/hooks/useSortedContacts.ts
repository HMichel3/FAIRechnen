import { useMemo } from 'react'
import { usePersistedStore } from '../stores/usePersistedStore'
import { sortByName } from '../utils/common'

export const useSortedContacts = () => {
  const contacts = usePersistedStore(s => s.contacts)

  return useMemo(() => {
    return sortByName(contacts)
  }, [contacts])
}
