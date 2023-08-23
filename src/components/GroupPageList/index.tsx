import { IonReorderGroup, IonItemOption, useIonAlert, IonText } from '@ionic/react'
import { peopleSharp } from 'ionicons/icons'
import { clone, isEmpty } from 'ramda'
import { useEffect, useState } from 'react'
import { isGroupActive, isLast } from '../../App/utils'
import { GroupInfo } from '../../pages/GroupPage/GroupInfo'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { SlidingListItem } from '../SlidingListItem'
import { Show } from '../SolidComponents/Show'
import { ArchivedGroups } from './ArchivedGroups'

interface GroupPageListProps {
  reorder: boolean
}

export const GroupPageList = ({ reorder }: GroupPageListProps) => {
  const groups = usePersistedStore(s => s.groups)
  const groupArchive = usePersistedStore(s => s.groupArchive)
  const setGroups = usePersistedStore(s => s.setGroups)
  const deleteGroup = usePersistedStore(s => s.deleteGroup)
  const archiveGroup = usePersistedStore(s => s.archiveGroup)
  const [presentDeleteGroup] = useIonAlert()
  const [showGroupArchive, setShowGroupArchive] = useState(false)

  // needed to prevent an error while reordering restored groups
  const copiedGroups = clone(groups)
  const isGroupArchiveEmpty = isEmpty(groupArchive)

  useEffect(() => {
    setShowGroupArchive(false)
  }, [isGroupArchiveEmpty])

  const onDeleteGroup = (groupId: string) => {
    presentDeleteGroup({
      header: 'Wollen Sie die Gruppe wirklich löschen?',
      message:
        'Mit dem Löschen der Gruppe gehen sämtliche Informationen bezüglich der Mitglieder, der Einkäufe sowie möglicher offener Rechnungen verloren!',
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        { role: 'confirm', text: 'Löschen', handler: () => deleteGroup(groupId) },
      ],
    })
  }

  return (
    <>
      <Show
        when={!isEmpty(copiedGroups)}
        fallback={
          isGroupArchiveEmpty ? (
            <IonText className='grid h-full place-items-center text-lg text-neutral-400'>
              Füge neue Gruppen hinzu!
            </IonText>
          ) : null
        }
      >
        <IonReorderGroup
          disabled={!reorder}
          onIonItemReorder={({ detail }) => setGroups(detail.complete(copiedGroups))}
        >
          {copiedGroups.map(group => (
            <SlidingListItem
              key={group.id}
              label={group.name}
              routerLink={`/groups/${group.id}`}
              onDelete={() => onDeleteGroup(group.id)}
              icon={peopleSharp}
              labelComponent={<GroupInfo group={group} />}
              reorder={reorder}
              lines={isLast(group, copiedGroups) && !isEmpty(groupArchive) ? 'full' : 'inset'}
              rightSlideOption={<IonItemOption onClick={() => archiveGroup(group.id)}>Archivieren</IonItemOption>}
              activeIcon={isGroupActive(group)}
            />
          ))}
        </IonReorderGroup>
      </Show>
      <Show when={!isEmpty(groupArchive)}>
        <ArchivedGroups showGroupArchive={showGroupArchive} setShowGroupArchive={setShowGroupArchive} />
      </Show>
    </>
  )
}
