import { IonItemOption, IonReorderGroup, IonText, useIonAlert } from '@ionic/react'
import { peopleSharp } from 'ionicons/icons'
import { clone, isEmpty, isNotEmpty } from 'ramda'
import { useEffect, useState } from 'react'
import { isGroupActive } from '../../App/utils'
import { GroupInfo } from '../../pages/GroupPage/GroupInfo'
import { determineLines } from '../../pages/GroupPage/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { SlidingListItem } from '../SlidingListItem'
import { Show } from '../SolidComponents/Show'
import { ArchivedGroups } from './ArchivedGroups'

type GroupPageListProps = {
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
        when={isNotEmpty(copiedGroups)}
        fallback={
          isGroupArchiveEmpty ? (
            <IonText className='grid h-full place-items-center text-lg text-neutral-400'>
              Füge neue Gruppen hinzu!
            </IonText>
          ) : null
        }
      >
        <IonReorderGroup disabled={!reorder} onIonReorderEnd={({ detail }) => setGroups(detail.complete(copiedGroups))}>
          {copiedGroups.map((group, index) => (
            <SlidingListItem
              key={group.id}
              routerLink={`/groups/${group.id}`}
              onDelete={() => onDeleteGroup(group.id)}
              icon={peopleSharp}
              labelComponent={<GroupInfo group={group} />}
              reorder={reorder}
              lines={determineLines(index, copiedGroups, groupArchive)}
              rightSlideOption={<IonItemOption onClick={() => archiveGroup(group.id)}>Archivieren</IonItemOption>}
              activeIcon={isGroupActive(group)}
              detail
            />
          ))}
        </IonReorderGroup>
      </Show>
      <Show when={isNotEmpty(groupArchive)}>
        <ArchivedGroups showGroupArchive={showGroupArchive} setShowGroupArchive={setShowGroupArchive} />
      </Show>
    </>
  )
}
