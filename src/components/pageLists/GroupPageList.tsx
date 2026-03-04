import { IonReorderGroup } from '@ionic/react'
import { peopleSharp } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { clone, hasAtLeast, isEmptyish } from 'remeda'
import { useOverlay } from '../../hooks/useOverlay'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { Group } from '../../types/store'
import { isGroupActive } from '../../utils/common'
import { determineLines } from '../../utils/display'
import { DeleteAlert } from '../alerts/DeleteAlert'
import { ArchivedGroups } from '../ArchivedGroups'
import { GroupInfo } from '../info/GroupInfo'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

type GroupPageListProps = {
  reorder: boolean
}

export const GroupPageList = ({ reorder }: GroupPageListProps) => {
  const groups = usePersistedStore(s => s.groups)
  const groupArchive = usePersistedStore(s => s.groupArchive)
  const setGroups = usePersistedStore(s => s.setGroups)
  const deleteGroup = usePersistedStore(s => s.deleteGroup)
  const archiveGroup = usePersistedStore(s => s.archiveGroup)
  const deleteGroupOverlay = useOverlay<Group>()
  const [showGroupArchive, setShowGroupArchive] = useState(false)

  // needed to prevent an error while reordering restored groups
  const copiedGroups = clone(groups)
  const isGroupArchiveEmpty = isEmptyish(groupArchive)

  useEffect(() => {
    setShowGroupArchive(false)
  }, [isGroupArchiveEmpty])

  if (isEmptyish(copiedGroups) && isGroupArchiveEmpty) {
    return <FullscreenText>Füge neue Gruppen hinzu!</FullscreenText>
  }

  return (
    <>
      <div className='pb-20'>
        {hasAtLeast(copiedGroups, 1) && (
          <IonReorderGroup
            disabled={!reorder}
            onIonReorderEnd={({ detail }) => setGroups(detail.complete(copiedGroups))}
          >
            {copiedGroups.map((group, index) => (
              <SlidingListItem
                key={group.id}
                icon={peopleSharp}
                label={<GroupInfo group={group} />}
                routerLink={`/groups/${group.id}`}
                onDelete={() => deleteGroupOverlay.onSelect(group)}
                onArchive={() => archiveGroup(group.id)}
                reorder={reorder}
                isActive={isGroupActive(group)}
                lines={determineLines(index, copiedGroups, groupArchive)}
                detail
              />
            ))}
          </IonReorderGroup>
        )}
        {hasAtLeast(groupArchive, 1) && (
          <ArchivedGroups
            groupArchive={groupArchive}
            showGroupArchive={showGroupArchive}
            setShowGroupArchive={setShowGroupArchive}
          />
        )}
      </div>
      <DeleteAlert
        overlay={deleteGroupOverlay}
        onDelete={deleteGroup}
        message='Alle Mitglieder, Einkäufe, Einkommen und Zahlungen dieser Gruppe werden unwiderruflich entfernt.'
      />
    </>
  )
}
