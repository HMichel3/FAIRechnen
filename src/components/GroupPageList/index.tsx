import { IonReorderGroup, IonItemOption, IonAlert } from '@ionic/react'
import clsx from 'clsx'
import { peopleSharp } from 'ionicons/icons'
import { isEmpty } from 'ramda'
import { useEffect, useState } from 'react'
import { isLast } from '../../App/utils'
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
  const [showDeleteGroupAlert, setShowDeleteGroupAlert] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [showGroupArchive, setShowGroupArchive] = useState(false)

  // needed to prevent an error while reordering restored groups
  const copiedGroups = [...groups]
  const isGroupArchiveEmpty = isEmpty(groupArchive)

  useEffect(() => {
    setShowGroupArchive(false)
  }, [isGroupArchiveEmpty])

  const onDeleteGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
    setShowDeleteGroupAlert(true)
  }

  return (
    <>
      <IonReorderGroup disabled={!reorder} onIonItemReorder={({ detail }) => setGroups(detail.complete(copiedGroups))}>
        {copiedGroups.map(group => (
          <SlidingListItem
            key={group.id}
            label={group.name}
            routerLink={`/groups/${group.id}`}
            onDelete={() => onDeleteGroup(group.id)}
            icon={peopleSharp}
            labelComponent={<GroupInfo groupId={group.id} />}
            reorder={reorder}
            lines={isLast(group, copiedGroups) && !isEmpty(groupArchive) ? 'full' : 'inset'}
            transparentLine={isLast(group, copiedGroups) && isEmpty(groupArchive)}
            className={clsx({ 'item-thick-full-line': isLast(group, copiedGroups) && !isEmpty(groupArchive) })}
            iconClassName={clsx({ 'item-smaller-icon-margin': isLast(group, copiedGroups) && !isEmpty(groupArchive) })}
            rightSlideOption={
              <IonItemOption className='sliding-archive' color='warning' onClick={() => archiveGroup(group.id)}>
                Archivieren
              </IonItemOption>
            }
          />
        ))}
      </IonReorderGroup>
      <Show when={!isEmpty(groupArchive)}>
        <ArchivedGroups showGroupArchive={showGroupArchive} setShowGroupArchive={setShowGroupArchive} />
      </Show>
      <IonAlert
        cssClass='delete-alert'
        isOpen={showDeleteGroupAlert}
        onDidDismiss={() => setShowDeleteGroupAlert(false)}
        header='Wollen Sie die Gruppe wirklich löschen?'
        message='Mit dem Löschen der Gruppe gehen sämtliche Informationen bezüglich der Mitglieder, der Einkäufe sowie möglicher offener Rechnungen verloren!'
        buttons={[
          { role: 'cancel', text: 'Abbrechen' },
          { text: 'Löschen', handler: () => deleteGroup(selectedGroupId) },
        ]}
      />
    </>
  )
}
